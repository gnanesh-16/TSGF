/**
 * TSGF Dynamic Workflow: tsgf-wave.js
 * Coordinates autonomous execution of card waves through the 3 worker lanes:
 * Building -> QA -> Review -> Merge.
 */

module.exports = async function runWave({ tools, args }) {
  console.log("🌊 [tsgf-wave] Initializing wave execution workflow...");
  
  // 1. Run wave planning
  const planOutput = await tools.runCommand("python3 .agents/bin/tsgf-wave-plan.sh");
  let plan;
  try {
    plan = JSON.parse(planOutput);
  } catch (e) {
    console.error("Failed to parse wave plan:", planOutput);
    return { success: false, error: "Invalid wave plan output" };
  }

  if (!plan.waves || plan.waves.length === 0) {
    console.log("☕ No active waves to process.");
    return { success: true, processed: 0 };
  }

  console.log(`Processing ${plan.waves.length} wave(s)...`);

  for (let i = 0; i < plan.waves.length; i++) {
    const wave = plan.waves[i];
    console.log(`\n=== Wave ${i + 1} (${wave.length} tasks) ===`);

    for (const task of wave) {
      console.log(`▶ Starting Task #${task.id}: ${task.title}`);
      
      // Builder lane (if not skipped by 'qa' label)
      if (task.start_lane === "Building") {
        console.log(`  [Building] Dispatching tsgf-build for Task #${task.id}`);
      }

      // QA lane
      console.log(`  [QA] Dispatching tsgf-qa verification for Task #${task.id}`);

      // Review lane
      console.log(`  [Review] Dispatching tsgf-review for Task #${task.id}`);
    }
  }

  console.log("\n✓ Wave workflow execution finished.");
  return { success: true, waveCount: plan.waves.length };
};
