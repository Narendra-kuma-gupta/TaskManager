import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/tasks" element={<Tasks />} />
  <Route path="/team" element={<Team />} />
  <Route path="/settings" element={<Settings />} />
  
</Route>
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;