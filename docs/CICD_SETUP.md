# CI/CD Setup Guide - Mithrandir Admin Dashboard

## Overview

This guide explains how to set up automated CI/CD for the Mithrandir Admin Dashboard using GitHub Actions, Tailscale VPN, and SSH deployment.

## Architecture

```
GitHub Actions Runner
    ↓
Tailscale VPN (OAuth)
    ↓
SSH to Mithrandir (100.77.230.53)
    ↓
Deploy & Restart Service
```

## Prerequisites

1. **GitHub Repository**: `nbost130/mithrandir-admin`
2. **Production Server**: Mithrandir (100.77.230.53)
3. **Tailscale Account**: For secure VPN access
4. **SSH Access**: To production server

## Step 1: Tailscale OAuth Setup

### Create OAuth Client

1. Go to [Tailscale Admin Console](https://login.tailscale.com/admin/settings/oauth)
2. Click "Generate OAuth client"
3. **Scopes**: Select `auth_keys` with **WRITE** access
4. **Tags**: Add `tag:ci` (for CI/CD runners)
5. Save the **Client ID** and **Client Secret**

### Create ACL Tag (if not exists)

In Tailscale Admin Console → Access Controls, add:

```json
{
  "tagOwners": {
    "tag:ci": ["autogroup:admin"]
  }
}
```

## Step 2: SSH Key Setup

### Generate SSH Key (if needed)

```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions-mithrandir-admin" -f ~/.ssh/github_actions_mithrandir_admin

# Copy public key to production server
ssh-copy-id -i ~/.ssh/github_actions_mithrandir_admin.pub nbost@100.77.230.53
```

### Test SSH Access

```bash
ssh -i ~/.ssh/github_actions_mithrandir_admin nbost@100.77.230.53 "echo 'SSH works!'"
```

## Step 3: GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | Description |
|------------|-------|-------------|
| `TAILSCALE_OAUTH_CLIENT_ID` | `tskey-client-...` | Tailscale OAuth Client ID |
| `TAILSCALE_OAUTH_SECRET` | `tskey-...` | Tailscale OAuth Secret |
| `MITHRANDIR_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | SSH private key content |

**Important**: For `MITHRANDIR_SSH_KEY`, paste the entire private key including the header and footer lines.

## Step 4: Production Server Setup

### Create Systemd Service

```bash
# SSH to production server
ssh nbost@100.77.230.53

# Create service file
cat > ~/.config/systemd/user/mithrandir-admin.service << 'EOF'
[Unit]
Description=Mithrandir Admin Dashboard
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/nbost/Projects/mithrandir-admin
ExecStart=/usr/bin/npm run preview -- --host 0.0.0.0 --port 3000
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
EOF

# Enable and start service
systemctl --user daemon-reload
systemctl --user enable mithrandir-admin
systemctl --user start mithrandir-admin

# Check status
systemctl --user status mithrandir-admin
```

### Verify Service

```bash
# Check if service is running
curl http://localhost:3000

# View logs
journalctl --user -u mithrandir-admin -f
```

## Step 5: Workflow Configuration

The workflows are already configured in `.github/workflows/`:

### CI Workflow (`ci.yml`)

**Triggers**: Push to `main`, Pull Requests
**Actions**:
- Install dependencies
- Lint code
- Format check
- Build project

### Deploy Workflow (`deploy.yml`)

**Triggers**: Push to `main` (code changes only), Manual dispatch
**Actions**:
- Connect to Tailscale VPN
- SSH to production server
- Pull latest changes
- Install dependencies
- Build project
- Restart systemd service
- Verify deployment

## Smart Deployment Triggers

| File Type | CI Runs? | Deploy Runs? | Example |
|-----------|----------|--------------|---------|
| Code files (`.ts`, `.tsx`, `.js`, `.json`) | ✅ Yes | ✅ Yes | `src/components/Dashboard.tsx` |
| Documentation (`.md`, `docs/`) | ✅ Yes | ❌ No | `README.md`, `docs/SETUP.md` |
| Config files (`.gitignore`, `LICENSE`) | ✅ Yes | ❌ No | `.gitignore` |

## Testing the Setup

### Test 1: Documentation Change (Should NOT Deploy)

```bash
# Make a documentation change
echo "## Test" >> README.md
git add README.md
git commit -m "docs: Test deployment skip"
git push origin main

# Expected: CI runs, Deployment skips
```

### Test 2: Code Change (Should Deploy)

```bash
# Make a code change
# Edit package.json version or any .ts file
git add .
git commit -m "feat: Test automated deployment"
git push origin main

# Expected: CI runs, Deployment runs
```

## Monitoring Deployments

### GitHub Actions

1. Go to repository → Actions tab
2. View workflow runs
3. Check logs for each step

### Production Server

```bash
# View service logs
journalctl --user -u mithrandir-admin -f

# Check service status
systemctl --user status mithrandir-admin

# Verify deployment
curl http://localhost:3000
```

## Troubleshooting

### Tailscale Connection Fails

**Error**: "Failed to connect to Tailscale"

**Solution**:
1. Verify OAuth credentials in GitHub Secrets
2. Check that `tag:ci` exists in Tailscale ACLs
3. Ensure `auth_keys` scope has WRITE access

### SSH Connection Fails

**Error**: "Permission denied (publickey)"

**Solution**:
1. Verify SSH key is added to GitHub Secrets
2. Check that public key is in `~/.ssh/authorized_keys` on server
3. Test SSH connection manually

### Deployment Fails

**Error**: "Failed to restart service"

**Solution**:
1. Check service logs: `journalctl --user -u mithrandir-admin -n 50`
2. Verify service file exists: `systemctl --user cat mithrandir-admin`
3. Check if port 3000 is available: `lsof -i :3000`

### Build Fails

**Error**: "npm install failed"

**Solution**:
1. Check `package.json` for syntax errors
2. Verify Node.js version compatibility
3. Clear cache: `rm -rf node_modules package-lock.json && npm install`

## Rollback Procedure

If a deployment fails:

```bash
# SSH to production server
ssh nbost@100.77.230.53

# Navigate to project
cd /home/nbost/Projects/mithrandir-admin

# Revert to previous commit
git log --oneline -5  # Find previous commit hash
git reset --hard <previous-commit-hash>

# Rebuild and restart
npm install
npm run build
systemctl --user restart mithrandir-admin
```

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use Tailscale VPN** for secure access (not public SSH)
3. **Rotate SSH keys** periodically
4. **Use ephemeral Tailscale nodes** (automatic with GitHub Action)
5. **Monitor deployment logs** for suspicious activity
6. **Use least-privilege access** for service accounts

## Related Documentation

- [CLAUDE.md](../CLAUDE.md) - Project overview and development guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Quick deployment reference
- [Tailscale GitHub Action](https://github.com/tailscale/github-action)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

