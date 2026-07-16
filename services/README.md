# services/

Backend services for moot-space live here, one directory per service (e.g. `services/auth`, `services/feed`, `services/chat`, `services/media`).

Conventions:

- Each service is its own npm workspace package with its own `package.json`, named `@moot-space/service-<name>` (e.g. `@moot-space/service-auth`).
- Each service picks its own framework/stack as it's built — nothing is prescribed here in advance.
- Shared code (types, schemas, clients) that multiple services need belongs in [`packages/`](../packages/README.md), not copy-pasted between services.
- CI/task orchestration is handled by Turborepo (see root `turbo.json`) — a service's `build`/`lint`/`test:unit` scripts get picked up automatically once it's added as a workspace.
