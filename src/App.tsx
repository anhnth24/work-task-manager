import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { BoardPage } from './pages/BoardPage';
import { DashboardPage } from './pages/DashboardPage';
import { TaskModal } from './components/task/TaskModal';
import { DeleteConfirmModal } from './components/task/DeleteConfirmModal';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout><BoardPage /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
      </Routes>
      <TaskModal />
      <DeleteConfirmModal />
    </>
  );
}
