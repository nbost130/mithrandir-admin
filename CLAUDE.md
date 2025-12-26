# Mithrandir Admin Dashboard - Project Guide

## Project Overview

**Mithrandir Admin Dashboard** is a unified admin interface for managing services on the Mithrandir server (100.77.230.53). Built with React, TypeScript, TanStack Router, and shadcn/ui components.

### Key Features

- **Services Monitoring**: Real-time health checks and status for all Mithrandir services
- **Transcription Management**: Interface for managing transcription jobs via the Palantir API
- **Dashboard Analytics**: System metrics and service statistics
- **Modern UI**: Built with shadcn/ui components and TailwindCSS

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Routing**: TanStack Router
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Package Manager**: npm (use npm, not pnpm or yarn)

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Deployment

### Automated Deployment

The project uses GitHub Actions for automated deployment to the Mithrandir server.

**Deployment Triggers:**
- Push to `main` branch (code changes only)
- Manual workflow dispatch

**Smart Deployment:**
- ✅ Code changes (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`) → Deploy
- ❌ Documentation changes (`.md`, `docs/`) → Skip deployment
- ❌ Config files (`.gitignore`, `LICENSE`) → Skip deployment

**Deployment Process:**
1. GitHub Actions connects via Tailscale VPN
2. SSH to production server (100.77.230.53)
3. Pull latest changes from GitHub
4. Install dependencies (`npm install`)
5. Build project (`npm run build`)
6. Restart systemd service (`systemctl --user restart mithrandir-admin`)
7. Verify deployment (health check on port 3000)

### Production Server

**Location**: `/home/nbost/Projects/mithrandir-admin`
**Service**: `mithrandir-admin.service` (systemd user service)
**Port**: 3000
**URL**: http://100.77.230.53:3000/

**Service Management:**
```bash
# Check status
systemctl --user status mithrandir-admin

# Restart service
systemctl --user restart mithrandir-admin

# View logs
journalctl --user -u mithrandir-admin -f
```

## Project Structure

```
mithrandir-admin/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   └── layout/       # Layout components (sidebar, header)
│   ├── features/         # Feature-specific components
│   │   ├── dashboard/    # Dashboard analytics
│   │   ├── services/     # Services monitoring
│   │   └── transcription/ # Transcription management
│   ├── routes/           # TanStack Router routes
│   ├── stores/           # Zustand state stores
│   └── lib/              # Utility functions
├── .github/
│   └── workflows/        # GitHub Actions workflows
│       ├── ci.yml        # Continuous Integration
│       └── deploy.yml    # Automated Deployment
├── docs/                 # Documentation
└── dist/                 # Production build output
```

## API Integration

### Services API

**Endpoint**: `http://100.77.230.53:9003/api/v1/services/health`

Fetches health status for all registered services in Consul.

### Transcription API

**Endpoint**: `http://100.77.230.53:9003/api/v1/transcription/*`

Manages transcription jobs via the Palantir transcription service.

## Related Documentation

- [CI/CD Setup Guide](docs/CICD_SETUP.md) - Detailed setup instructions
- [Deployment Guide](docs/DEPLOYMENT.md) - Quick deployment reference
- [GitHub Repository](https://github.com/nbost130/mithrandir-admin)

## Development Guidelines

1. **Use npm**: This project uses npm, not pnpm or yarn
2. **Follow TypeScript**: Strict TypeScript configuration
3. **Component Structure**: Use shadcn/ui components for consistency
4. **Routing**: Use TanStack Router file-based routing
5. **State Management**: Use Zustand for global state
6. **API Calls**: Use TanStack Query for data fetching
7. **Styling**: Use TailwindCSS utility classes

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, check for other services:

```bash
# Check what's using port 3000
lsof -i :3000

# Check Docker containers
docker ps | grep 3000
```

### Build Failures

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Service Not Starting

```bash
# Check service logs
journalctl --user -u mithrandir-admin -n 50

# Check if port is available
lsof -i :3000

# Restart service
systemctl --user restart mithrandir-admin
```

