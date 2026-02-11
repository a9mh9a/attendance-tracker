
import React from 'react';
import { ViewType, UserData } from '../types';
import { LayoutDashboard, ListChecks, Calendar, BarChart3, Clock, User, Sun, Moon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  user: UserData;
  onToggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, user, onToggleTheme }) => {
  const isNight = user.theme === 'ليلي';

  return (
    <div className={`flex flex-col min-h-screen max-w-md mx-auto relative shadow-xl overflow-hidden transition-colors duration-300 ${isNight ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`${isNight ? 'bg-slate-900 border-white/5' : 'bg-indigo-900 border-indigo-800'} text-white p-5 sticky top-0 z-10 shadow-lg border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl border-2 overflow-hidden flex items-center justify-center shadow-inner ${isNight ? 'border-slate-700 bg-slate-800' : 'border-indigo-400 bg-indigo-800'}`}>
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={24} className={isNight ? 'text-slate-600' : 'text-indigo-400'} />
              )}
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{user.jobTitle} {user.name}</h1>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${isNight ? 'text-slate-400' : 'text-indigo-300'}`}>نظام 24/48</p>
            </div>
          </div>
          
          <button 
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl transition-all active:scale-95 ${isNight ? 'bg-slate-800 text-amber-400' : 'bg-indigo-800 text-indigo-200'}`}
          >
            {isNight ? <Sun size={22} fill="currentColor" /> : <Moon size={22} fill="currentColor" />}
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 overflow-y-auto no-scrollbar">
        {children}
      </main>

      <nav className={`${isNight ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'} border-t fixed bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around p-2 z-10 shadow-2xl`}>
 <NavItem active={currentView === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={22} />} label="الرئيسية" isNight={isNight} />
  <NavItem active={currentView === 'attendance'} onClick={() => setView('attendance')} icon={<ListChecks size={22} />} label="الحضور" isNight={isNight} />
  <NavItem active={currentView === 'overtime'} onClick={() => setView('overtime')} icon={<Clock size={22} />} label="إضافي" isNight={isNight} />
  <NavItem active={currentView === 'calendar'} onClick={() => setView('calendar')} icon={<Calendar size={22} />} label="الجدول" isNight={isNight} />
  <NavItem active={currentView === 'reports'} onClick={() => setView('reports')} icon={<BarChart3 size={22} />} label="التقارير" isNight={isNight} />
</nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; isNight: boolean }> = ({ 
  active, onClick, icon, label, isNight 
}) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
    active 
      ? (isNight ? 'text-indigo-400 scale-105' : 'text-indigo-600 scale-105') 
      : (isNight ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600')
  }`}>
    {icon}
    <span className="text-[9px] mt-1 font-black">{label}</span>
  </button>
);

export default Layout;
