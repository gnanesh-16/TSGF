#!/usr/bin/env python3
"""
TSGF Signal Collection: collect_sentry.py
Fetches unresolved Sentry issues and exceptions within the lookback window.
"""
import os
import sys
import json
import urllib.request
from collect_common import compute_fingerprint, format_ticket_body

def list_issues(auth_token: str = None, org_slug: str = None, project_slug: str = None, days: int = 14):
    token = auth_token or os.environ.get("SENTRY_AUTH_TOKEN")
    if not token:
        # Return mock / offline candidate for graceful dry-run
        return [
            {
                "id": "sentry-101",
                "title": "[bug] Unhandled IndexError in payment checkout webhook",
                "fingerprint": compute_fingerprint("sentry", "IndexError", "checkout/webhook.py:88"),
                "body": format_ticket_body(
                    title="Unhandled IndexError in payment checkout webhook",
                    problem="IndexError: list index out of range when webhook payload contains empty items array.",
                    context="Occurs during Stripe charge.succeeded events under high load.",
                    solution="Add bounds check before accessing line_items[0].",
                    ac_list=["Empty payload returns 200 with skipped processing", "Valid payloads execute successfully"]
                )
            }
        ]

    # In live mode with token, query Sentry REST API
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    url = f"https://sentry.io/api/0/projects/{org_slug}/{project_slug}/issues/?query=is:unresolved"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            results = []
            for item in data[:10]:
                results.append({
                    "id": item.get("id"),
                    "title": f"[bug] {item.get('title')}",
                    "fingerprint": compute_fingerprint("sentry", "error", item.get("id")),
                    "body": format_ticket_body(
                        title=item.get("title"),
                        problem=item.get("culprit", "Sentry unresolved exception"),
                        context=f"Events count: {item.get('count', 1)}",
                        solution="Investigate stacktrace and add unit test proving fix.",
                        ac_list=["Exception no longer occurs", "Unit test passes"]
                    )
                })
            return results
    except Exception as e:
        sys.stderr.write(f"Sentry API error: {e}\n")
        return []

if __name__ == "__main__":
    issues = list_issues()
    print(json.dumps(issues, indent=2))
