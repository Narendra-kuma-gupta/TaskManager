import { API_BASE_URL } from '../config';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { CheckSquare, Calendar, Bookmark } from 'lucide-react';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const userId = user?._id || user?.id; 

    if (userId) {
      fetch(`${API_BASE_URL}/api/tasks`)
        .then(res => res.json())
        .then(data => {
          const filtered = (data ?? []).filter(t => {
            const taskAssignedId = t.assignedTo?._id || t.assignedTo;
            const taskCreatorId = t.creatorId?._id || t.creatorId;

            return String(taskAssignedId) === String(userId) || 
                   String(taskCreatorId) === String(userId);
          });
          setList(filtered);
        })
        .catch(err => console.error("Repository fetch failed:", err));
    }
  }, [user?._id, user?.id]);

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
      <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      <main className={`flex-1 transition-all duration-300 p-8 lg:p-12 ${isExpanded ? 'ml-64' : 'ml-24'}`}>
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center gap-4 tracking-tight">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <CheckSquare className="text-indigo-400 w-8 h-8" />
            </div>
            Task Repository
          </h1>
          <p className="text-slate-400 mt-4 font-medium">A complete history of your workspace contributions and archives.</p>
        </header>

        <div className="space-y-4">
          {list.length > 0 ? list.map(t => (
            <div 
              key={t._id} 
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-slate-600 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-cyan-500 shadow-inner group-hover:text-indigo-400 transition-colors">
                  <Bookmark size={20} />
                </div>
                <div>
                  <p className="font-bold text-white text-lg tracking-tight">{t.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                      t.status === 'Completed' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {t.status}
                    </span>
                    <span className="text-slate-700 hidden md:block">•</span>
                    <span className="text-slate-500 text-[11px] font-bold uppercase tracking-tighter">
                      {t.priority || 'Normal'} Priority
                    </span>
                    <span className="text-slate-700 hidden md:block">•</span>
                    <span className="text-slate-400 text-[11px] font-medium">
                      Assignee: <span className="text-slate-200">{t.assignedTo?.name || 'Unassigned'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 text-left md:text-right flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar size={14} className="text-cyan-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Deadline</span>
                </div>
                <span className="text-white font-mono text-sm">{t.dueDate}</span>
              </div>
            </div>
          )) : (
            <div className="py-32 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem] bg-slate-900/30 backdrop-blur-sm">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="text-slate-600 w-8 h-8" />
              </div>
              <p className="text-slate-500 font-medium italic">No assignments archived in your repository yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tasks;