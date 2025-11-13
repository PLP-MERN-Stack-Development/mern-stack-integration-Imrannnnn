# Operations Guide

## Services
- Backend (Render Web Service): Express API
- Frontend (Render Static Site): Vite React
- Database: MongoDB Atlas

## Environments
- Production: branch `main`
- Staging (optional): branch `develop`

## Environment Variables
- Server
  - NODE_ENV=production
  - PORT=5000
  - MONGODB_URI=...
  - JWT_SECRET=...
  - CLIENT_URL=https://<frontend>.onrender.com
  - LOG_LEVEL=info
  - SENTRY_DSN= (optional)
- Client
  - VITE_API_URL=https://<api>.onrender.com
  - VITE_SENTRY_DSN= (optional)

## Deployment
- CI: GitHub Actions in `.github/workflows/`
  - server-ci.yml: install, lint/test (if present), build (if present), then trigger Render API deploy hook
  - client-ci.yml: install, lint/test (if present), build, then trigger Render FE deploy hook
- CD: Render Deploy Hooks
  - Keep Auto-Deploy OFF to gate deploys by CI

## Health Checks
- Liveness: `GET /healthz` -> 200 ok
- Readiness: `GET /readyz` -> 200 ready (Mongo connected) else 503 not-ready
- Configure Render Health Check path to `/healthz`

## Monitoring
- Logs: `morgan` access logs, `winston` structured app logs
- Error + Performance: Sentry (server and client)
- Uptime: UptimeRobot monitors for API `/healthz` and frontend `/`
- Metrics: Render service metrics (CPU, memory, response time)

## Rollback
- Render: Service -> Events -> Rollback to previous successful deploy
- Git: `git revert <sha>` -> push to `main` -> CI passes -> hooks redeploy

## Backups
- MongoDB Atlas: enable backups (cloud backup or continuous)
- Test restore to staging before relying on it

## Security
- CORS limited via `CLIENT_URL`
- `helmet()` for secure headers
- Rotate `JWT_SECRET` periodically or on incident
- Never commit `.env`

## Maintenance Cadence
- Weekly: review Dependabot PRs, update non-breaking deps
- Monthly: audit prod errors in Sentry, triage high-frequency issues
- Quarterly: review infra sizing, CORS/domains, rotate secrets as needed

## Troubleshooting
- 500 errors -> check Render logs, `winston` output, Sentry traces
- CORS errors -> verify `CLIENT_URL` and `VITE_API_URL`
- Mongo connection -> check `MONGODB_URI` and Atlas Network Access
