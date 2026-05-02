import { API_BASE_URL } from '../config';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, login } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'Member');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const toastId = toast.loading('Syncing profile updates...');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${user._id || user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role }),
      });

      if (res.ok) {
        const updated = await res.json();
        login(updated, localStorage.getItem('token'));
        toast.success("Profile Securely Updated!", { id: toastId });
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Update failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Protocol error. Check connection.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      <main className={`flex-1 transition-all duration-300 p-8 lg:p-12 ${isExpanded ? 'ml-64' : 'ml-24'}`}>
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center gap-4 tracking-tight">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <SettingsIcon className="text-indigo-400 w-8 h-8" />
            </div> 
            Account Settings
          </h1>
          <p className="text-slate-400 mt-4 font-medium max-w-2xl">
            Configure your professional identity and modify your permissions within the workspace.
          </p>
        </header>

        <form 
          onSubmit={handleUpdate} 
          className="max-w-xl bg-slate-900 p-10 rounded-3xl border border-slate-800 space-y-8 shadow-2xl shadow-black/40 backdrop-blur-sm"
        >
          <div className="space-y-2">
            <label className="text-cyan-500 text-[11px] font-bold uppercase tracking-widest ml-1">Display Name</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-medium placeholder-slate-600" 
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-cyan-500 text-[11px] font-bold uppercase tracking-widest ml-1">Access Level</label>
            <div className="relative">
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="Member" className="bg-slate-900">Project Member</option>
                <option value="Admin" className="bg-slate-900">Project Manager (Admin)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98] text-lg border border-white/10"
            >
              <Save size={20} /> Deploy Changes
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-4 font-medium uppercase tracking-tight">
              System changes take effect immediately
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Settings;