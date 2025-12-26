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

The dashboard integrates with:

- **Transcription API**: http://100.77.230.53:9003/api/v1
- **Unified API**: http://100.77.230.53:9003 (future)

## 📝 Configuration

Environment variables in `.env`:

```
VITE_APP_TITLE="Mithrandir Admin"
VITE_TRANSCRIPTION_API=http://100.77.230.53:9003/api/v1
VITE_UNIFIED_API=http://100.77.230.53:9003
```

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

The admin dashboard will be served on port 3000 and proxied through nginx.

## 📖 Documentation

See project documentation in `~/Documentation/`

---

**Built with ❤️ for Mithrandir homelab infrastructure**
