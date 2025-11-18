# 📋 Work Task Manager

A modern, full-featured task management application built with React, TypeScript, and Tailwind CSS. Features a Kanban board, analytics dashboard, and integrated sticky notes.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff)

## ✨ Features

### 📊 Kanban Board
- **Drag & Drop**: Move tasks between columns (To Do, In Progress, In Review, Done)
- **Position Control**: Drop tasks at any position (top, middle, or bottom)
- **Task Management**: Create, edit, and delete tasks with confirmation
- **Rich Task Details**: Title, description, assignee, priority, tags, and due dates
- **Visual Indicators**: Color-coded priorities and overdue date warnings

### 🔍 Advanced Filtering & Search
- **Multi-select Filters**: Filter by assignees, tags, and priorities
- **Real-time Search**: Search tasks by title or description
- **Clear All Filters**: Quick reset functionality

### 📈 Analytics Dashboard
- **Key Metrics**: Task completion rate, total tasks, overdue tasks
- **Visual Charts**: Status distribution, priority matrix, velocity trends
- **Team Insights**: Workload distribution and leaderboard

### 📝 Sticky Notes
- **Modal Interface**: Large editor for creating/editing notes
- **8 Color Options**: Yellow, Pink, Blue, Green, Purple, Orange, Teal, Rose
- **Search & Filter**: Find notes quickly with real-time search
- **Delete Confirmation**: Prevent accidental deletions
- **Persistent Storage**: Notes saved in localStorage

### 🎨 User Experience
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions and hover effects
- **Data Persistence**: All data saved in IndexedDB

## 🛠️ Tech Stack

- **Frontend**: React 18.3, TypeScript 5.6
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Vite 6.0
- **State Management**: Zustand
- **Database**: Dexie.js (IndexedDB wrapper)
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anhnth24/work-task-manager.git
   cd work-task-manager
   ```

2. **Install pnpm** (if not already installed)
   ```bash
   npm install -g pnpm
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

## 💻 Development Mode

Run the development server with hot module replacement:

```bash
pnpm dev
```

The app will be available at:
- Local: `http://localhost:5173`
- Network: `http://<your-ip>:5173`

## 🏭 Production Build

### Option 1: Build Only

Build the project for production:

```bash
pnpm build
```

The built files will be in the `dist/` folder.

### Option 2: Build + Preview

Build and preview the production build locally:

```bash
pnpm build
pnpm preview
```

## 🚀 Deploy with PM2 (Recommended for Production)

PM2 is a production process manager for Node.js applications. It keeps your app running 24/7 and provides easy management.

### Step 1: Install PM2

```bash
npm install -g pm2
```

### Step 2: Build the Application

```bash
pnpm install
pnpm build
```

### Step 3: Serve with PM2

**Default port (8080):**
```bash
pm2 serve dist 8080 --name task-manager --spa
```

**Custom port (e.g., 8899):**
```bash
pm2 serve dist 8899 --name task-manager --spa
```

**Important**: The `--spa` flag is required for React Router to work correctly.

### Step 4: Save PM2 Process List

```bash
pm2 save
```

### Step 5: Access the Application

- **Local machine**: `http://localhost:8899`
- **Network access**: `http://<your-ip>:8899`

To find your IP address:
- **Windows**: Run `ipconfig` in terminal
- **Mac/Linux**: Run `ifconfig` or `ip addr`

### PM2 Management Commands

```bash
# View running processes
pm2 list

# View logs
pm2 logs task-manager

# Stop the application
pm2 stop task-manager

# Restart the application
pm2 restart task-manager

# Delete from PM2
pm2 delete task-manager

# Monitor resources
pm2 monit

# Startup script (auto-start on boot - Linux/Mac only)
pm2 startup
pm2 save
```

### Update Application

When you pull new changes from git:

```bash
# Pull latest changes
git pull origin main

# Rebuild
pnpm install
pnpm build

# Restart PM2
pm2 restart task-manager
```

## 🌐 Network Access

To access the app from other devices on your local network:

1. **Find your local IP address**:
   - Windows: `ipconfig` → Look for "IPv4 Address"
   - Mac: `ifconfig` → Look for "inet" under your network adapter
   - Linux: `ip addr` → Look for "inet" under your network adapter

2. **Configure Firewall** (Windows):
   - Open Windows Firewall
   - Allow inbound connections on port 8899 (or your chosen port)

3. **Access from other devices**:
   - Open browser on any device on the same network
   - Navigate to: `http://<your-ip>:8899`

## 📁 Project Structure

```
work-task-manager/
├── src/
│   ├── components/          # React components
│   │   ├── board/          # Kanban board components
│   │   ├── layout/         # Layout components (Sidebar, Header)
│   │   ├── notes/          # Sticky notes feature
│   │   ├── task/           # Task modals
│   │   └── ui/             # Reusable UI components
│   ├── data/               # Database configuration
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── dist/                   # Production build (generated)
└── package.json            # Dependencies and scripts
```

## 📜 Available Scripts

```bash
# Development
pnpm dev          # Start dev server

# Building
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint
```

## 🗄️ Database

The app uses **IndexedDB** (via Dexie.js) for persistent storage:
- **Database Name**: TaskManagerDB
- **Tables**: users, tasks, activities
- **Sticky Notes**: Stored in localStorage

### Reset Database

Open browser console and run:
```javascript
window.resetDatabase()
```

## 🎨 Customization

### Change Port

**Development** (vite.config.ts):
```typescript
export default defineConfig({
  server: {
    port: 3000 // Your custom port
  }
})
```

**Production with PM2**:
```bash
pm2 serve dist <your-port> --name task-manager --spa
```

### Change Theme Colors

Edit `src/types/index.ts` to customize tag colors, note colors, etc.

## 🐛 Troubleshooting

### PM2 Not Found
```bash
npm install -g pm2
```

### Port Already in Use
```bash
# Stop the process using the port
pm2 delete task-manager

# Or use a different port
pm2 serve dist 8900 --name task-manager --spa
```

### Build Errors
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies.

---

**Author**: Hải Anh  
**Repository**: https://github.com/anhnth24/work-task-manager
