import { createContext, useState, useEffect, useMemo, useCallback } from 'react';

// 1. Export the Context itself
export const AuthContext = createContext(null);

// 2. Define the Provider as a named function component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoized login to prevent re-renders
  const login = useCallback((userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  }, []);

  // Memoized logout
  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("AuthContext: Data recovery failed", error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // 3. Memoize the value object so children don't re-render on every tick
  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading
  }), [user, loading, login, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
          <div className="text-rose-400 font-black uppercase tracking-widest text-[10px] animate-pulse">
            Synchronizing Workspace...
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}