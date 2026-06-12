import React, { useState } from 'react';
import { BookOpen, User, Menu, X, Brain, Calendar, FileText, BarChart2, MessageSquare, Award, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  studentName: string;
  onLogout?: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, studentName, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'practice', label: 'Practice', icon: Award },
    { id: 'tests', label: 'Mock Tests', icon: Brain },
    { id: 'planner', label: 'AI Planner', icon: Calendar },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0F1728]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent">
              CareerHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-sans text-sm font-medium transition-all duration-250 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action: User Info Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-xs text-slate-500 font-sans font-medium">Welcome back,</span>
              <span className="text-sm font-semibold text-slate-200 font-sans">{studentName || 'Student'}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-sans font-bold text-white shadow border border-slate-750">
              {(studentName || 'S').charAt(0).toUpperCase()}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="ml-2 flex items-center gap-1 text-slate-400 hover:text-rose-400 bg-slate-800/40 hover:bg-rose-500/10 border border-slate-850 hover:border-rose-500/20 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200"
                title="Log Out From Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0F172A] border-b border-slate-850 px-2 pt-2 pb-4 space-y-1 transition-all">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-base font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
          {/* User Profile Info on Mobile */}
          <div className="border-t border-slate-800 mt-3 pt-3 px-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                {(studentName || 'S').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-slate-350">{studentName || 'Student'}</span>
            </div>
            {onLogout && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-400 font-medium py-2 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out from CareerHub
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
