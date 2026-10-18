# Deploy and rollback

Not done yet. Requires owner approval for each environment.

Create databases (one time):
```
npx wrangler d1 create mhws-staging
npx wrangler d1 create mhws-production
```
Put the returned IDs in `wrangler.toml`, then:
```
npx wrangler d1 migrations apply mhws-staging --remote --env staging
npx wrangler secret put LINK_SECRET --env staging     # repeat for each secret
npx wrangler deploy --env staging
```
Production uses the same commands with `--env production`, only after `npm run preflight` exits 0.

Rollback: `npx wrangler deployments list --env production`, then `npx wrangler rollback <version-id> --env production`. Migrations are additive; never edit an applied migration file.
