import React, { useState } from 'react';
import { User, UserRole, AppNotification } from '../types';
import { Shield, Languages, Bell, LogIn, LogOut, FileCheck, Menu, X } from 'lucide-react';

interface NavBarProps {
  currentUser: User | null;
  currentRole: UserRole;
  selectedLang: string;
  onRoleChange: (role: UserRole) => void;
  onLangChange: (lang: string) => void;
  onLogout: () => void;
  onLoginClick: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export default function NavBar({
  currentUser,
  currentRole,
  selectedLang,
  onRoleChange,
  onLangChange,
  onLogout,
  onLoginClick,
  notifications,
  onMarkNotificationRead,
}: NavBarProps) {
  const [showBell, setShowBell] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const languages = [
    'English', 'Hindi', 'Tamil', 'Gujarati', 'Marathi', 'Punjabi', 'Kannada', 'Malayalam', 'Telugu'
  ];

  const roles: UserRole[] = ['Contractor', 'Architect', 'Municipal Officer', 'Admin'];

  // Simple dictionary translation for titles on the navbar
  const translate = (text: string) => {
    if (selectedLang === 'Hindi') {
      if (text === 'PermitFlow') return 'परमिटफ्लो';
      if (text === 'The Construction Compliance Autopilot') return 'भवन अनुपालन ऑटोपायलट';
    }
    if (selectedLang === 'Tamil') {
      if (text === 'PermitFlow') return 'பெர்மிட்ஃப்ளோ';
    }
    return text;
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 animate-pulse">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="font-sans font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                {translate('PermitFlow')}
              </span>
              <p className="text-[9px] font-mono font-bold text-blue-600 tracking-wider hidden sm:block">
                {translate('The Construction Compliance Autopilot')}
              </p>
            </div>
          </div>

          {/* Center Role Quick-Switcher for Demonstration */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200">
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-blue-600" /> Demo Role:
            </span>
            <div className="flex items-center space-x-1">
              {roles.map((role) => (
                <button
                  key={role}
                  id={`role-btn-${role.toLowerCase().replace(' ', '-')}`}
                  onClick={() => onRoleChange(role)}
                  className={`px-3 py-1 rounded-full text-xs font-sans font-semibold transition-all duration-200 ${
                    currentRole === role
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side Options */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Multilingual Selector */}
            <div className="relative flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <Languages className="w-4 h-4 text-blue-600" />
              <select
                id="language-select"
                value={selectedLang}
                onChange={(e) => onLangChange(e.target.value)}
                className="bg-transparent text-slate-700 border-none outline-none cursor-pointer focus:ring-0 font-sans font-medium"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang} className="bg-white text-slate-800">
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setShowBell(!showBell)}
                className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 relative transition-colors duration-150"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showBell && (
                <div id="notification-dropdown" className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider">System Alerts</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] text-slate-400 italic">Click message to read</span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">No new notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationRead(n.id)}
                          className={`p-2.5 rounded-lg text-xs transition-colors duration-150 cursor-pointer ${
                            n.read 
                              ? 'bg-slate-50 text-slate-500 border border-slate-100' 
                              : 'bg-blue-50/70 border border-blue-100 text-slate-800 hover:bg-blue-100/50'
                          }`}
                        >
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{n.title}</span>
                            <span className="text-[9px] font-mono text-blue-600">
                              {n.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] mt-1 text-slate-600 leading-tight">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth Action */}
            {currentUser ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-[10px] font-mono text-blue-600 font-bold">{currentRole}</p>
                </div>
                <button
                  id="logout-btn"
                  onClick={onLogout}
                  className="p-2 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg border border-slate-200 text-slate-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-btn-header"
                onClick={onLoginClick}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-all duration-150 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center space-x-2">
            <select
              id="mobile-lang-select"
              value={selectedLang}
              onChange={(e) => onLangChange(e.target.value)}
              className="bg-white border border-slate-200 rounded px-1.5 py-1 text-xs text-slate-800 outline-none focus:ring-0 font-sans font-medium"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border border-slate-200"
            >
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenu && (
        <div id="mobile-menu" className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-mono block mb-2 uppercase font-bold">Demo Role Quick Switch</span>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  id={`role-btn-mobile-${role.toLowerCase().replace(' ', '-')}`}
                  onClick={() => {
                    onRoleChange(role);
                    setMobileMenu(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold text-center transition-all ${
                    currentRole === role
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-t border-slate-100 pl-1">
            <span className="text-xs font-bold text-slate-500">User Session</span>
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-800 font-bold">{currentUser.name} ({currentRole})</span>
                <button
                  id="mobile-logout-btn"
                  onClick={() => {
                    onLogout();
                    setMobileMenu(false);
                  }}
                  className="px-3 py-1 bg-red-50 border border-red-200 hover:bg-red-100 text-xs text-red-600 font-semibold rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                id="mobile-login-btn"
                onClick={() => {
                  onLoginClick();
                  setMobileMenu(false);
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs text-white font-bold rounded-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
