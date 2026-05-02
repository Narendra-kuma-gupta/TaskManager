import { API_BASE_URL } from '../config';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AddTaskModal from '../components/AddTaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, CheckCircle2, Zap, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const currentUserId = user?._id || user?.id;

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      const data = await response.json();
      setTasks(data ?? []);
    } catch (e) { 
      console.error("Fetch Tasks Error:", e); 
    }
  };

  useEffect(() => { 
    fetchTasks(); 
  }, []);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, userId: currentUserId }),
      });
      if (res.ok) { 
        fetchTasks(); 
        toast.success(`Task ${newStatus}`); 
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const displayTasks = (tasks ?? []).filter(t => {
    if (user?.role === 'Admin') return true; 
    const taskAssignedId = t.assignedTo?._id || t.assignedTo;
    return String(taskAssignedId) === String(currentUserId);
  });

  const activeTasks = displayTasks.filter(t => t.status !== 'Completed');

  // Theme Constants based on Dark Indigo Palette
  const accentText = user?.role === 'Admin' ? 'text-indigo-400' : 'text-cyan-400';
  const accentBg = user?.role === 'Admin' ? 'bg-indigo-500/10' : 'bg-cyan-500/10';
  const accentGradient = user?.role === 'Admin' ? 'from-indigo-600 to-indigo-500' : 'from-cyan-600 to-cyan-500';

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      <main className={`flex-1 transition-all duration-300 p-8 lg:p-12 ${isExpanded ? 'ml-64' : 'ml-24'}`}>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Workspace</h1>
            <p className="text-slate-400 mt-2 font-medium">
              Welcome back, <span className={`${accentText} font-bold`}>{user?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 relative hover:text-white transition-all shadow-lg"
              >
                <Bell className="w-5 h-5" />
                {displayTasks.some(t => t.status === 'Pending') && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse border-2 border-slate-900" />
                )}
              </button>
              
              <AnimatePresence>
                {showNotif && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-5 backdrop-blur-xl"
                  >
                    <h3 className="text-slate-500 font-bold text-[11px] mb-4 uppercase tracking-widest">Recent Activity</h3>
                    <div className="space-y-3">
                      {displayTasks.filter(t => t.status === 'Pending').slice(-3).map(t => (
                        <div key={t._id} className="text-xs text-slate-300 border-b border-slate-800 pb-3 last:border-0">
                          New assignment: <span className="text-cyan-400 font-semibold italic">"{t.title}"</span>
                        </div>
                      ))}
                      {displayTasks.filter(t => t.status === 'Pending').length === 0 && (
                        <p className="text-[11px] text-slate-500 italic">No new alerts.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user?.role === 'Admin' && (
              <button 
                onClick={() => setIsModalOpen(true)} 
                className={`bg-gradient-to-r ${accentGradient} text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-95`}
              >
                <Plus className="w-5 h-5" /> New Task
              </button>
            )}
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-amber-500 w-5 h-5" />
            </div>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Pending</p>
            <p className="text-3xl text-white font-bold mt-1">{displayTasks.filter(t => t.status === 'Pending').length}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className={`w-10 h-10 ${accentBg} rounded-lg flex items-center justify-center mb-4`}>
              <Zap className={`${accentText} w-5 h-5`} />
            </div>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Accepted</p>
            <p className="text-3xl text-white font-bold mt-1">{displayTasks.filter(t => t.status === 'Accepted').length}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle2 className="text-emerald-500 w-5 h-5" />
            </div>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Active Total</p>
            <p className="text-3xl text-white font-bold mt-1">{activeTasks.length}</p>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-bold tracking-tight">Current Assignments</h2>
            <div className="h-px flex-1 bg-slate-800 ml-6 hidden md:block" />
          </div>

          {activeTasks.length > 0 ? activeTasks.slice(-5).reverse().map((task) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={task._id} 
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-600 transition-all gap-4 shadow-sm"
            >
              <div className="flex items-center gap-5">
                <div className={`w-2.5 h-2.5 rounded-full ${task.priority === 'High' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`} />
                <div>
                  <h3 className="text-white font-bold text-lg">{task.title}</h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-1">{task.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-950 text-slate-400 uppercase tracking-widest border border-slate-800 font-mono">
                  {task.status}
                </span>

                <div className="flex items-center gap-2">
                  {task.status === 'Pending' && user?.role === 'Member' && (
                    <button 
                      onClick={() => handleUpdateStatus(task._id, 'Accepted')} 
                      className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-2 rounded-lg text-xs font-bold hover:bg-cyan-500 hover:text-white transition-all"
                    >
                      Accept
                    </button>
                  )}
                  {task.status === 'Accepted' && (
                    <button 
                      onClick={() => handleUpdateStatus(task._id, 'Completed')} 
                      className={`bg-gradient-to-r ${accentGradient} text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg hover:brightness-110`}
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-16 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/40">
              <p className="text-slate-500 font-medium italic">No current assignments found.</p>
            </div>
          )}
        </div>
      </main>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskAdded={fetchTasks} 
        userId={currentUserId} 
      />
    </div>
  );
};

export default Dashboard;