import { API_BASE_URL } from '../config';
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Command } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (password.length < 1) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const toastId = toast.loading('Authenticating...');
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        toast.success('Access granted. Redirecting...', { id: toastId });
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Invalid email or password', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error. Ensure your backend is live on Render', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 sm:p-10 shadow-2xl shadow-black/50">
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/25">
              <Command className="text-white w-7 h-7" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-wide">TaskQuest</h2>
            <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide uppercase">Secure Login Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="email" 
                required 
                className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all" 
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
                className="w-full bg-slate-900 border border-slate-600 text-white placeholder-slate-500 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 outline-none transition-all" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <motion.button 
              whileHover={{ y: -2 }} 
              whileTap={{ scale: 0.98 }} 
              type="submit" 
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all border border-indigo-400/30"
            >
              Authenticate <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          <div className="mt-8 text-center border-t border-slate-700 pt-6">
            <p className="text-sm text-slate-400">
              New to TaskQuest? 
              <Link to="/signup" className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline ml-2 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;