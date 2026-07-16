# packages/

Shared code consumed by [`apps/`](../apps/) and [`services/`](../services/) lives here (e.g. shared types/schemas, a UI kit, an API client).

Conventions:

- Each package is its own npm workspace package with its own `package.json`, named `@moot-space/<name>` (e.g. `@moot-space/shared-types`).
- Consuming packages depend on it like any other npm dependency (`"@moot-space/shared-types": "*"`) — npm workspaces resolves it locally via symlink, no publishing required.
- Only pull code in here once it's actually needed by more than one app/service — don't pre-emptively split things out.
