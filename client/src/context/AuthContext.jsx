import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = localStorage.getItem('careerprep_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          // Fetch fresh profile in background
          try {
            const res = await api.get('/auth/profile');
            const freshUser = { ...parsed, ...res.data, token: parsed.token };
            setUser(freshUser);
            localStorage.setItem('careerprep_user', JSON.stringify(freshUser));
          } catch (fetchErr) {
            console.warn('Profile sync warning:', fetchErr.message);
          }
        } catch (e) {
          localStorage.removeItem('careerprep_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    setUser(data);
    localStorage.setItem('careerprep_user', JSON.stringify(data));
    return data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const data = res.data;
    setUser(data);
    localStorage.setItem('careerprep_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    localStorage.removeItem('careerprep_user');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      if (user) {
        const updated = { ...user, ...res.data, token: user.token };
        setUser(updated);
        localStorage.setItem('careerprep_user', JSON.stringify(updated));
        return updated;
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  const updateUser = (newUserData) => {
    const updated = { ...user, ...newUserData };
    setUser(updated);
    localStorage.setItem('careerprep_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
