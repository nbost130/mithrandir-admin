# 🧙‍♂️ Mithrandir Admin - The One Admin to Rule Them All

Modern, professional admin dashboard for managing all Mithrandir services.

## 🎯 Features

### Phase 1: Transcription Dashboard (CURRENT)

- ✅ Real-time transcription job monitoring
- ✅ Job status tracking (pending, processing, completed, failed)
- ✅ Progress indicators and statistics
- ✅ Job retry and delete functionality
- ✅ Auto-refresh every 5 seconds
- ✅ Search and filtering
- ✅ Modern UI with shadcn/ui components

### Coming Soon

- 🔄 Delegation System Dashboard
- 🎯 n8n Workflow Management
- 📊 System Monitoring & Health
- 🗄️ Database Management
- ⚙️ Service Control Panel

## 🚀 Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Routing**: TanStack Router
- **State**: TanStack Query (React Query)
- **Tables**: TanStack Table
- **Icons**: Lucide React

## 📦 Installation

```bash
cd ~/Projects/mithrandir-admin
npm install
```

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 API Integration

**⚠️ CRITICAL: This dashboard MUST use the Mithrandir Unified API (port 8080)**

The dashboard integrates with the **Mithrandir Unified API**, which acts as an API Gateway/BFF (Backend for Frontend):

- **Unified API**: http://100.77.230.53:8080 (API Gateway)
  - `/api/dashboard/*` - Dashboard statistics and activity
  - `/transcription/*` - Transcription jobs (proxied to Palantir backend)
  - `/ssh-status` - System monitoring
  - `/services/*` - Service health checks

**DO NOT** point directly to backend services (e.g., port 9003). The Unified API provides:
- ✅ Consistent API contracts
- ✅ Centralized CORS, authentication, rate limiting
- ✅ Service abstraction and flexibility
- ✅ Data aggregation from multiple backend services

## 📝 Configuration

Environment variables in `.env`:

```bash
# ✅ CORRECT - Always use Unified API (port 8080)
VITE_APP_TITLE="Mithrandir Admin"
VITE_API_BASE_URL=http://100.77.230.53:8080
VITE_TRANSCRIPTION_API=http://100.77.230.53:8080/transcription
VITE_UNIFIED_API=http://100.77.230.53:8080

# Network Configuration
VITE_ALLOWED_HOSTS=dashboard.shire,admin.shire,mithrandir-admin.shire,localhost,100.77.230.53
```

**❌ INCORRECT - Do NOT use backend service ports directly:**

```bash
# ❌ WRONG - Do not point to backend services!
VITE_API_BASE_URL=http://100.77.230.53:9003
VITE_TRANSCRIPTION_API=http://100.77.230.53:9003/api/v1
```

## 🔧 API Type Generation

This project uses TypeScript types generated from the Transcription Palantir OpenAPI specification for type-safe API integration.

**Regenerate types after Transcription Palantir API updates:**

```bash
# Generate types from local API (default)
npm run generate:types

# Or specify custom API URL
TRANSCRIPTION_API_URL=http://palantir.tailnet:3001 npm run generate:types
```

**Generated file:** `src/types/palantir.d.ts`

**Usage example:**
```typescript
import type { paths, components } from './types/palantir';

type JobsResponse = paths['/api/v1/jobs']['get']['responses']['200']['content']['application/json'];
type Job = components['schemas']['Job'];
```

**When to regenerate:**
- After updating Transcription Palantir API
- When TypeScript compilation errors indicate type mismatches
- Before deploying changes

See [Transcription Palantir: Consumer Type Generation Guide](https://github.com/nbost130/transcription-palantir/blob/main/docs/CONSUMER_TYPE_GENERATION.md) for complete documentation.

## 🎨 Project Structure

```
src/
├── routes/                    # Route definitions
│   └── _authenticated/
│       └── transcription/    # Transcription routes
├── features/                 # Feature modules
│   └── transcription/        # Transcription feature
│       ├── components/       # UI components
│       ├── api/             # API integration
│       └── data/            # Types and constants
└── components/              # Shared components
```

## 🚀 Deployment

The admin dashboard is deployed on Mithrandir server:

- **Service**: `mithrandir-admin.service` (systemd user service)
- **Port**: 3000
- **Location**: `/home/nbost/Projects/mithrandir-admin/`
- **Auto-deploy**: Push to `main` branch triggers GitHub Actions deployment

### Deployment Process

```bash
# Local development
git add .
git commit -m "feat: your changes"
git push origin main

# GitHub Actions automatically:
# 1. Runs CI (lint, type-check, build)
# 2. Deploys to production via SSH
# 3. Restarts mithrandir-admin service
```

### Manual Deployment

```bash
# SSH to Mithrandir
ssh mithrandir

# Navigate to project
cd /home/nbost/Projects/mithrandir-admin

# Pull latest changes
git pull

# Install dependencies (if needed)
npm install

# Build
npm run build

# Restart service
systemctl --user restart mithrandir-admin
```

## 📖 Documentation

- [CI/CD Setup](./docs/CICD_SETUP.md) - GitHub Actions deployment configuration
- [Deployment Guide](./docs/DEPLOYMENT.md) - Detailed deployment instructions
- [Unified API Integration](../transcription-palantir/UNIFIED_API_INTEGRATION.md) - API architecture

## 🏗️ Architecture

```
Mithrandir Admin Dashboard (Port 3000)
           │
           │ HTTP/REST
           ▼
Mithrandir Unified API (Port 8080)
           │
           ├─→ /api/dashboard/*  → Dashboard stats
           ├─→ /transcription/*  → Transcription Palantir (Port 9003)
           ├─→ /ssh-status       → System monitoring
           └─→ /services/*       → Service health
```

---

**Built with ❤️ for Mithrandir homelab infrastructure**
