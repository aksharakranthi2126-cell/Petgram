import React, { useState } from 'react';
import {
  HeartHandshake,
  AlertTriangle,
  MapPin,
  Sparkles,
  Search,
  Users,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  ChevronDown,
  FolderHeart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavTab =
  | 'home'
  | 'report'
  | 'nearby'
  | 'firstaid'
  | 'missing'
  | 'community'
  | 'messages'
  | 'activity'
  | 'admin';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, isAdmin, isVolunteer, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleNav = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'report', label: 'Report Distress', icon: <AlertTriangle className="w-4 h-4 text-amber-500" /> },
    { id: 'nearby', label: 'Nearby Help', icon: <MapPin className="w-4 h-4 text-emerald-600" /> },
    { id: 'firstaid', label: 'AI First Aid', icon: <Sparkles className="w-4 h-4 text-teal-600" />, badge: 'Gemini' },
    { id: 'missing', label: 'Missing & Found', icon: <Search className="w-4 h-4 text-sky-600" /> },
    { id: 'community', label: 'Volunteers', icon: <Users className="w-4 h-4 text-indigo-600" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4 text-emerald-600" /> },
    { id: 'activity', label: 'My Activity', icon: <FolderHeart className="w-4 h-4 text-rose-500" /> },
    { id: 'admin', label: 'Admin Desk', icon: <ShieldCheck className="w-4 h-4 text-purple-600" />, badge: isAdmin ? 'Live' : 'Preview' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-emerald-950/10 transition-colors">
      {/* Top Urgent Emergency Alert Ticker */}
      <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>
            24/7 National Emergency Animal Helpline: <strong className="text-white font-bold tracking-wide">1962</strong> / Blue Cross Rapid Ambulance: <strong className="text-white font-bold tracking-wide">+91 90000 88214</strong>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-emerald-300">Hackathon Mode:</span>
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>{currentUser.role === 'admin' ? 'Admin / Rescue Desk' : currentUser.role === 'volunteer' ? 'Volunteer' : 'Citizen Reporter'}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Role:
                </div>
                <button
                  onClick={() => {
                    switchRole('user');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${
                    currentUser.role === 'user' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Citizen Good Samaritan</span>
                  {currentUser.role === 'user' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                </button>
                <button
                  onClick={() => {
                    switchRole('volunteer');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${
                    currentUser.role === 'volunteer' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Verified Volunteer</span>
                  {currentUser.role === 'volunteer' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                </button>
                <button
                  onClick={() => {
                    switchRole('admin');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-purple-50 ${
                    currentUser.role === 'admin' ? 'text-purple-700 font-bold bg-purple-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Admin Coordinator
                  </span>
                  {currentUser.role === 'admin' && <span className="w-2 h-2 rounded-full bg-purple-600"></span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-emerald-950">
                  PET<span className="text-emerald-600">GRAM</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 rounded-full">
                  Rescue Net
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 tracking-wide">
                Every Paw Deserves Care
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-emerald-900 bg-emerald-100/70 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider ${
                        link.id === 'firstaid'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('report')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold text-sm shadow-md shadow-orange-950/20 hover:shadow-lg transition-all transform active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 text-orange-200 animate-bounce" />
              <span>Report Animal</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <div className="p-3 bg-emerald-50 rounded-xl mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatarUrl}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border border-emerald-300"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[11px] text-emerald-700 capitalize font-medium">Role: {currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={() => switchRole(currentUser.role === 'admin' ? 'user' : 'admin')}
              className="px-2.5 py-1 text-xs bg-white rounded-lg border border-slate-200 font-semibold text-slate-700"
            >
              Switch to {currentUser.role === 'admin' ? 'Reporter' : 'Admin'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`p-3 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  {link.icon}
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleNav('report')}
              className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Report Distressed Animal Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
