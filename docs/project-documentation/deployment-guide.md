# Deployment Guide (Summary)

Refer to `docs/CICD_SETUP.md` and `docs/DEPLOYMENT.md` for full procedures. This summary highlights the key operational path.

## Automated Pipeline
1. Developer pushes to `main` (code or config changes).
2. GitHub Actions `ci.yml` runs lint + build.
3. On success, `deploy.yml` connects to Mithrandir via Tailscale OAuth client (`tag:ci`).
4. Workflow SSHs into `100.77.230.53`, pulls latest code, installs deps, builds, and restarts systemd service `mithrandir-admin`.
5. Health check: `curl http://localhost:3000` (internal) before completing job.

## Manual Deployment
```bash
ssh nbost@100.77.230.53
cd /home/nbost/Projects/mithrandir-admin
npm install
npm run build
systemctl --user restart mithrandir-admin
curl http://localhost:3000
```

## Service Management
- `systemctl --user status mithrandir-admin`
- `journalctl --user -u mithrandir-admin -f`
- `systemctl --user restart mithrandir-admin`

## Troubleshooting Checklist
- **Port 3000 busy:** `lsof -i :3000` → kill conflicting process.
- **Build fails:** `rm -rf node_modules package-lock.json && npm install && npm run build`.
- **Service stuck:** `systemctl --user cat mithrandir-admin` to validate unit file; run `npm run preview -- --host 0.0.0.0 --port 3000` manually to debug.
- **CI blocked:** ensure Tailscale OAuth client + secrets (`TAILSCALE_OAUTH_CLIENT_ID`, `TAILSCALE_OAUTH_SECRET`, `MITHRANDIR_SSH_KEY`) are valid.

## Rollback
```bash
ssh nbost@100.77.230.53
cd /home/nbost/Projects/mithrandir-admin
git log --oneline -5
git reset --hard <commit>
npm install && npm run build
systemctl --user restart mithrandir-admin
```

## Upcoming Enhancements
- Deploy only when relevant directories change (already partially configured by workflow path filters).
- Mirror GitHub Issues in documentation for deployment-related TODOs.
