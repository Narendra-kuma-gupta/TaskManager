import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, CheckSquare, Users, Settings, 
  LogOut, Zap, ChevronLeft, Menu 
} from 'lucide-react';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Dark Theme Mapping: Indigo for Admin | Cyan for Member
  const accentClass = user?.role === 'Admin' ? 'from-indigo-600 to-indigo-500' : 'from-cyan-600 to-cyan-500';
  const borderAccent = user?.role === 'Admin' ? 'border-indigo-500/30' : 'border-cyan-500/30';
  const textAccent = user?.role === 'Admin' ? 'text-indigo-400' : 'text-cyan-400';
  const shadowAccent = user?.role === 'Admin' ? 'shadow-indigo-500/20' : 'shadow-cyan-500/20';

  const handleLogout = () => {
    localStorage.clear();
    if (setUser) setUser(null);
    navigate('/login', { replace: true });
    window.location.reload();
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <motion.aside 
      animate={{ width: isExpanded ? 260 : 88 }}
      className="bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-50 transition-all duration-300 shadow-[10px_0_30px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center justify-between p-6 mb-4">
        {isExpanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className={`bg-gradient-to-tr ${accentClass} p-2 rounded-xl shadow-lg ${shadowAccent}`}>
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">TaskQuest</span>
          </motion.div>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white mx-auto transition-colors border border-slate-700"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all group
              ${isActive 
                ? `bg-gradient-to-r ${accentClass} text-white shadow-xl ${shadowAccent} border ${borderAccent}` 
                : `text-slate-400 hover:bg-slate-800 hover:text-slate-100`}
            `}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${!isExpanded && 'mx-auto'}`} />
            {isExpanded && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{item.name}</motion.span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900/50 backdrop-blur-md">
        <div className={`flex items-center gap-3 mb-4 p-2 rounded-2xl bg-slate-800/40 border border-slate-700/50 ${!isExpanded && 'justify-center'}`}>
          <div className={`w-10 h-10 shrink-0 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center ${textAccent} font-bold shadow-inner`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-100 truncate">{user?.name}</p>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${textAccent}`}>{user?.role}</p>
            </div>
          )}
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 font-bold hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          {isExpanded && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;