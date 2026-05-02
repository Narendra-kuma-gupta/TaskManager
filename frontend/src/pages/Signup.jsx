import { API_BASE_URL } from '../config';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Member');
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const toastId = toast.loading('Creating your workspace...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      
      const data = await response.json();

      if (response.ok) {
        toast.success('Account created! Please sign in.', { id: toastId });
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error. Ensure your backend is live on Render', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="w-full max-w-md"
      >
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 sm:p-10 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
              <UserPlus className="text-white w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-wide">Create Account</h2>
            <p className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-wider">Start your journey</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                required 
                className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="email" 
                required 
                className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="password" 
                required 
                className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all" 
                placeholder="Password (min. 8 chars)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="password" 
                required 
                className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>

            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <select 
                className="w-full bg-slate-900 border border-slate-600 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none appearance-none cursor-pointer" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Member">Project Member</option>
                <option value="Admin">Project Manager (Admin)</option>
              </select>
            </div>

            <motion.button 
              whileHover={{ y: -2 }} 
              whileTap={{ scale: 0.98 }} 
              type="submit" 
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all border border-indigo-400/30"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          <div className="mt-8 text-center border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-400">
              Already have an account? 
              <Link to="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline ml-2 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;