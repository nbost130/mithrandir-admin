# Deployment Guide - Mithrandir Admin Dashboard

## Quick Reference

### Production Environment

- **Server**: Mithrandir (100.77.230.53)
- **Location**: `/home/nbost/Projects/mithrandir-admin`
- **Service**: `mithrandir-admin.service`
- **Port**: 3000
- **URL**: http://100.77.230.53:3000/

## Automated Deployment

### Trigger Deployment

**Method 1: Push Code Changes**
```bash
git add .
git commit -m "feat: Your changes"
git push origin main
```

**Method 2: Manual Workflow Dispatch**
1. Go to GitHub → Actions → 🚀 Deploy to Production
2. Click "Run workflow"
3. Select branch: `main`
4. Click "Run workflow"

### Deployment Triggers

| Change Type | Triggers Deployment? |
|------------|---------------------|
| Code files (`.ts`, `.tsx`, `.js`) | ✅ Yes |
| Styles (`.css`) | ✅ Yes |
| Config (`.json`, `.yml`) | ✅ Yes |
| Documentation (`.md`) | ❌ No |
| Docs folder (`docs/`) | ❌ No |
| Git files (`.gitignore`) | ❌ No |

## Manual Deployment

### SSH to Production

```bash
ssh nbost@100.77.230.53
cd /home/nbost/Projects/mithrandir-admin
```

### Deploy Steps

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
npm install

# 3. Build project
npm run build

# 4. Restart service
systemctl --user restart mithrandir-admin

# 5. Verify deployment
curl http://localhost:3000
```

### One-Line Deploy

```bash
cd /home/nbost/Projects/mithrandir-admin && \
git pull origin main && \
npm install && \
npm run build && \
systemctl --user restart mithrandir-admin && \
sleep 3 && \
curl -f http://localhost:3000 && \
echo "✅ Deployment successful!"
```

## Service Management

### Check Status

```bash
# Service status
systemctl --user status mithrandir-admin

# View logs (live)
journalctl --user -u mithrandir-admin -f

# View last 50 log lines
journalctl --user -u mithrandir-admin -n 50
```

### Control Service

```bash
# Start service
systemctl --user start mithrandir-admin

# Stop service
systemctl --user stop mithrandir-admin

# Restart service
systemctl --user restart mithrandir-admin

# Reload systemd configuration
systemctl --user daemon-reload
```

## Verification

### Health Checks

```bash
# Check if service is responding
curl http://localhost:3000

# Check from external network (via Tailscale)
curl http://100.77.230.53:3000

# Check service status
systemctl --user is-active mithrandir-admin
```

### Troubleshooting

```bash
# Check if port is in use
lsof -i :3000

# Check process
ps aux | grep vite

# Check disk space
df -h

# Check memory
free -h
```

## Rollback

### Quick Rollback

```bash
# SSH to production
ssh nbost@100.77.230.53
cd /home/nbost/Projects/mithrandir-admin

# View recent commits
git log --oneline -10

# Rollback to previous commit
git reset --hard HEAD~1

# Or rollback to specific commit
git reset --hard <commit-hash>

# Rebuild and restart
npm install
npm run build
systemctl --user restart mithrandir-admin
```

### Rollback via GitHub

1. Find the commit to rollback to
2. Create a revert commit:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. Automated deployment will deploy the reverted version

## CI/CD Pipeline

### Workflow Steps

1. **📥 Checkout code** - Clone repository
2. **🔗 Connect to Tailscale** - Establish VPN connection
3. **🔐 Setup SSH** - Configure SSH authentication
4. **📝 Add SSH known hosts** - Trust production server
5. **🚀 Deploy to production**:
   - Pull latest changes
   - Install dependencies
   - Build project
   - Restart service
   - Verify deployment

### Monitor Deployment

**GitHub Actions**:
1. Go to repository → Actions tab
2. Click on latest workflow run
3. View logs for each step

**Production Server**:
```bash
# Watch logs during deployment
journalctl --user -u mithrandir-admin -f
```

## Common Issues

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill <PID>

# Or stop conflicting Docker container
docker ps | grep 3000
docker stop <container-id>
```

### Service Won't Start

```bash
# Check service logs
journalctl --user -u mithrandir-admin -n 50

# Check service file
systemctl --user cat mithrandir-admin

# Reload systemd
systemctl --user daemon-reload

# Try starting manually
cd /home/nbost/Projects/mithrandir-admin
npm run preview -- --host 0.0.0.0 --port 3000
```

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Git Issues

```bash
# Discard local changes
git reset --hard origin/main

# Clean untracked files
git clean -fd

# Force pull
git fetch origin
git reset --hard origin/main
```

## Emergency Procedures

### Service Down

```bash
# Quick restart
systemctl --user restart mithrandir-admin

# If that fails, manual start
cd /home/nbost/Projects/mithrandir-admin
npm run preview -- --host 0.0.0.0 --port 3000
```

### Complete Rebuild

```bash
cd /home/nbost/Projects/mithrandir-admin
git fetch origin
git reset --hard origin/main
rm -rf node_modules package-lock.json dist
npm install
npm run build
systemctl --user restart mithrandir-admin
```

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Project overview
- [CICD_SETUP.md](CICD_SETUP.md) - Detailed CI/CD setup guide
- [GitHub Repository](https://github.com/nbost130/mithrandir-admin)

