import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Users, Briefcase } from 'lucide-react';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users`)
      .then(res => res.json())
      .then(data => setMembers(data ?? []))
      .catch(err => console.error("Team fetch failed:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      <main className={`flex-1 transition-all duration-300 p-8 lg:p-12 ${isExpanded ? 'ml-64' : 'ml-24'}`}>
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center gap-4 tracking-tight">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <Users className="text-indigo-400 w-8 h-8" />
            </div> 
            Team Performance
          </h1>
          <p className="text-slate-400 mt-4 font-medium">Real-time workload distribution across your active members.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl group hover:border-slate-600 hover:shadow-2xl hover:shadow-black/40 transition-all relative overflow-hidden"
            >
              {/* Background Glow Effect */}
              <div className={`absolute -top-10 -right-10 w-24 h-24 blur-3xl opacity-10 rounded-full ${
                member.role === 'Admin' ? 'bg-indigo-500' : 'bg-cyan-500'
              }`} />

              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner border ${
                  member.role === 'Admin' 
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-widest border ${
                  member.role === 'Admin' 
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {member.role}
                </span>
              </div>

              <h3 className="text-white font-bold text-xl tracking-tight group-hover:text-cyan-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-slate-500 text-sm mb-8 font-medium truncate">{member.email}</p>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Active Tasks</span>
                </div>
                <span className="text-3xl font-bold text-white tracking-tighter">
                   {member.taskCount || 0}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <p className="text-slate-500 font-medium italic">Scanning for active team members...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Team;