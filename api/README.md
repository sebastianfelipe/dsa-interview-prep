# DSA Studio AI API

NestJS backend for the study UI.

## Scripts

```bash
yarn workspace api dev      # watch mode
yarn workspace api build
yarn workspace api start:prod
```

## Endpoints

| Path | Purpose |
|------|---------|
| `/api/catalog` | Topics + problems |
| `/api/problems/:topic/:slug` | Problem README + meta |
| `/api/problems/:topic/:slug/solution` | Solution source |
| `/api/problems/:topic/:slug/run` | Run solution tests |
| `/api/lists` | Prep-list coverage |
| `/api/docs` | Reference markdown index |
| `/api/swagger` | Swagger UI |
| `/api/swagger-json` | OpenAPI JSON |

Default port: `3001` (`PORT` env overrides).
