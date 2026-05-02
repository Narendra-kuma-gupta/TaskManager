import { API_BASE_URL } from '../config';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddTaskModal = ({ isOpen, onClose, onTaskAdded, userId }) => {
  const today = new Date().toISOString().split('T')[0];
  const [users, setUsers] = useState([]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(today);
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE_URL}/api/users`)
        .then(res => res.json())
        .then(data => setUsers(data ?? []))
        .catch(err => console.error("Failed to load users:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!assignedTo) {
      toast.error("Please select a team member!");
      return;
    }

    const finalCreatorId = typeof userId === 'object' ? userId?._id : userId;

    const payload = {
      title,
      description,
      priority,
      dueDate,
      status: 'Pending',
      creatorId: finalCreatorId, 
      assignedTo: assignedTo 
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Task Assigned!");
        onTaskAdded();
        onClose();
        setTitle(''); setDescription(''); setAssignedTo('');
      } else {
        const errorData = await res.json();
        console.error("Backend Error:", errorData);
        toast.error(errorData.detail || "Failed to deploy task");
      }
    } catch (err) {
      toast.error("Server connection failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-8 rounded-2xl shadow-2xl shadow-black/50">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">New Assignment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-cyan-400 transition-colors bg-slate-800 p-1 rounded-lg">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-cyan-500 uppercase ml-1 tracking-wider">Task Title</label>
            <input 
              required 
              placeholder="What needs to be done?" 
              className="w-full bg-slate-950/50 border border-slate-700 p-3.5 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all font-medium" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-cyan-500 uppercase ml-1 tracking-wider">Details</label>
            <textarea 
              placeholder="Add some helpful context..." 
              className="w-full bg-slate-950/50 border border-slate-700 p-3.5 rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all h-24 resize-none font-medium" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-cyan-500 uppercase ml-1 tracking-wider">Assign To</label>
            <div className="relative">
              <select 
                required 
                className="w-full bg-slate-950/50 border border-slate-700 p-3.5 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 appearance-none cursor-pointer font-medium" 
                value={assignedTo} 
                onChange={e => setAssignedTo(e.target.value)}
              >
                <option value="" className="bg-slate-900">Select a team member...</option>
                {users.map(u => <option key={u._id} value={u._id} className="bg-slate-900">{u.name}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-cyan-500 uppercase ml-1 tracking-wider">Priority</label>
                <select 
                  className="w-full bg-slate-950/50 border border-slate-700 p-3.5 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 appearance-none cursor-pointer font-medium" 
                  value={priority} 
                  onChange={e => setPriority(e.target.value)}
                >
                  <option value="Low" className="bg-slate-900">Low</option>
                  <option value="Medium" className="bg-slate-900">Medium</option>
                  <option value="High" className="bg-slate-900">High</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-cyan-500 uppercase ml-1 tracking-wider">Deadline</label>
                <input 
                  type="date" 
                  min={today} 
                  required 
                  className="w-full bg-slate-950/50 border border-slate-700 p-3.5 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 font-medium color-scheme-dark" 
                  style={{ colorScheme: 'dark' }}
                  value={dueDate} 
                  onChange={e => setDueDate(e.target.value)} 
                />
              </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98] mt-6 border border-indigo-400/20"
          >
            Deploy Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;