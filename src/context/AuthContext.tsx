import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVolunteer: boolean;
  switchRole: (role: 'user' | 'admin' | 'volunteer') => void;
  updateProfile: (profile: Partial<User>) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-demo',
  name: 'Akshara (Animal Advocate)',
  email: 'akshara.petcare@example.com',
  role: 'user',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  phoneMasked: '+91 98*** **412'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('petgram_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('petgram_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const switchRole = (role: 'user' | 'admin' | 'volunteer') => {
    if (role === 'admin') {
      setCurrentUser(prev => ({
        ...prev,
        role: 'admin',
        name: 'Rescue Desk Admin (Staff)',
        email: 'ops@petgram.org'
      }));
    } else if (role === 'volunteer') {
      setCurrentUser(prev => ({
        ...prev,
        role: 'volunteer',
        name: 'Priya Sundaram (Verified Volunteer)',
        email: 'priya.rescue@example.com'
      }));
    } else {
      setCurrentUser(DEFAULT_USER);
    }
  };

  const updateProfile = (profile: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...profile }));
  };

  const isAdmin = currentUser.role === 'admin';
  const isVolunteer = currentUser.role === 'volunteer' || currentUser.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: true,
        isAdmin,
        isVolunteer,
        switchRole,
        updateProfile
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
