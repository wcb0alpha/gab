# Agent Rule: Localhost Access

## Rule Definition
Agents are explicitly allowed to access `localhost` and `127.0.0.1` on any port (typically `8080` or `8081` in this project) for the purpose of:
- Running local development servers.
- Performing visual aesthetic audits via browser subagents.
- Verifying code changes in a live environment.

## Logic & Context
- This rule overrides any default sandboxing that might prevent agents from reaching internal network addresses.
- Agents should ensure that a local server is running before attempting to navigate to a localhost URL.
- If a connection is refused, agents should attempt to start the server (e.g., via `npx http-server`) before reporting a failure.

## Implementation Details
- This rule is stored in `.agents/rules/localhost_access.md`.
- Agents should reference this rule when encountering connection issues during browser-based testing.
