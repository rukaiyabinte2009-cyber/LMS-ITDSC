import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Video,
  FileCheck2,
  Award,
  ShieldCheck,
  Database,
  UserCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { store } from '../lib/storage';
import { INITIAL_USERS } from '../data/mockData';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openDbGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openDbGuide }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = store.currentUser;
  const pendingPaymentsCount = store.payments.filter((p) => p.status === 'submitted').length;
  const pendingSubmissionsCount = store.submissions.filter((s) => s.status === 'submitted').length;
  const totalAdminPending = pendingPaymentsCount + pendingSubmissionsCount;

  const handleSelectUser = (user: User) => {
    store.setCurrentUser(user);
    setUserDropdownOpen(false);
  };

  const navItems = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'mylearning', label: 'My Learning', icon: GraduationCap },
    { id: 'live', label: 'Live Classes', icon: Video, badge: 'Zoom' },
    { id: 'assignments', label: 'Assignments', icon: FileCheck2 },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  if (currentUser.role === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Admin Portal',
      icon: ShieldCheck,
      badge: totalAdminPending > 0 ? `${totalAdminPending} pending` : undefined,
    } as any);
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('courses')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight text-white">Learn</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  ITDS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">learn.itdatascience.com</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        item.id === 'admin'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Database & Architecture Guide Button */}
            <button
              onClick={openDbGuide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-teal-300 hover:bg-slate-700 border border-teal-500/30 transition-all shadow-sm group"
              title="View how PostgreSQL connects on cPanel & migration scripts"
            >
              <Database className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-12 transition-transform" />
              <span>Database & cPanel Guide</span>
            </button>

            {/* Quick Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-left transition-all"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner ${
                    currentUser.role === 'admin'
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500'
                      : 'bg-gradient-to-tr from-emerald-500 to-teal-500'
                  }`}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                    <span>{currentUser.role}</span>
                    {currentUser.role === 'admin' && <Sparkles className="w-2.5 h-2.5 text-amber-400" />}
                  </div>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 divide-y divide-slate-800">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Switch User Role (Demo Mode)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Test both the student learning experience and admin verification queue.
                    </p>
                  </div>
                  <div className="py-1">
                    {INITIAL_USERS.map((u) => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => handleSelectUser(u)}
                          className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 hover:bg-slate-800/80 transition-colors ${
                            isCurrent ? 'bg-slate-800/50 text-emerald-400 font-medium' : 'text-slate-300'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              u.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate text-white">{u.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {u.role === 'admin' ? 'Instructor / System Admin' : `${u.role} (${u.email})`}
                            </p>
                          </div>
                          {isCurrent && <UserCheck className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={openDbGuide}
              className="p-1.5 rounded-lg bg-slate-800 text-teal-400 border border-teal-500/30"
              title="Database Guide"
            >
              <Database className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-slate-900 border-b border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400 mb-2">Switch Active Role:</p>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    handleSelectUser(u);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs px-2.5 py-2 rounded-lg text-center font-medium border truncate ${
                    u.id === currentUser.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {u.name.split(' ')[0]} ({u.role})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
