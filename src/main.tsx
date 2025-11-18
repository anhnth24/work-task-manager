import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initializeDB } from './data/db';
import { loadFromDatabase } from './data/seed';
import { useTasksStore } from './store/useTasksStore';
import { useUsersStore } from './store/useUsersStore';
import { useUIStore } from './store/useUIStore';
import './utils/resetDatabase'; // Make resetDatabase available globally

// Initialize database and load data
async function init() {
  // Initialize DB with seed data if empty
  await initializeDB();

  // Load data from database into stores
  const { users, tasks, activities } = await loadFromDatabase();
  useUsersStore.getState().setUsers(users);
  useTasksStore.getState().setTasks(tasks);
  useTasksStore.getState().setActivities(activities);

  // Apply dark mode
  const darkMode = useUIStore.getState().darkMode;
  if (darkMode) {
    document.documentElement.classList.add('dark');
  }

  // Render app
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

// Start initialization
init().catch(console.error);
