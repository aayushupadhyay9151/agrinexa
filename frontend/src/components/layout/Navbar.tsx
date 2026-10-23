import React, { useState, useEffect } from 'react';
import { Sprout, CloudSun, BarChart3, History, Menu, X, User as UserIcon, LogOut, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, logout, demoLogin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'new-analysis', label: 'Crop Prediction' },
    { id: 'weather', label: 'Weather Intelligence' },
    { id: 'history', label: 'History' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
                Agri<span className="text-emerald-700">Nexa</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-emerald-800/80 -mt-1">
                Farm Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentTab('new-analysis')}
                  className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm transition-all hover:shadow-emerald-900/20 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ New Analysis</span>
                </button>

                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentTab === 'dashboard'
                      ? 'bg-emerald-100 text-emerald-900 font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setCurrentTab('profile')}
                  className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Farmer Profile"
                >
                  <UserIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => demoLogin()}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                  title="Explore instantly without creating an account"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>1-Click Demo</span>
                </button>

                <button
                  onClick={() => setCurrentTab('login')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-emerald-800 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Login
                </button>

                <button
                  onClick={() => setCurrentTab('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm hover:shadow-emerald-900/10 transition-all active:scale-95"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center space-x-2">
            {!user && (
              <button
                onClick={() => demoLogin()}
                className="px-2.5 py-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 rounded-md border border-emerald-200"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 pt-3 pb-4 mt-3 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  currentTab === link.id
                    ? 'text-emerald-800 bg-emerald-50 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setCurrentTab('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <span>Dashboard ({user.name})</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center space-x-2"
                  >
                    <UserIcon className="w-4 h-4 text-emerald-700" />
                    <span>My Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setCurrentTab('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('register');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-center text-sm font-medium text-white bg-emerald-800 rounded-lg"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
