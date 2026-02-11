
import React, { useState, useEffect } from 'react';
import { UserData, ViewType, AttendanceRecord, OvertimeRecord, AppTheme } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import Overtime from './components/Overtime';
import CalendarView from './components/Calendar';
import Reports from './components/Reports';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [overtime, setOvertime] = useState<OvertimeRecord[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('duty_user');
    const savedAttendance = localStorage.getItem('duty_attendance');
    const savedOvertime = localStorage.getItem('duty_overtime');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedAttendance) setAttendance(JSON.parse(savedAttendance));
    if (savedOvertime) setOvertime(JSON.parse(savedOvertime));
    
    setIsLoaded(true);
  }, []);

  // Monthly Reset and Report Generation Logic
  useEffect(() => {
    if (!user || !isLoaded) return;

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    if (user.lastReportMonth && user.lastReportMonth !== currentMonthKey) {
      generateAndDownloadReport();
      // Clear data for new month
      setAttendance([]);
      setOvertime([]);
      localStorage.setItem('duty_attendance', JSON.stringify([]));
      localStorage.setItem('duty_overtime', JSON.stringify([]));
      
      const updatedUser = { ...user, lastReportMonth: currentMonthKey };
      setUser(updatedUser);
      localStorage.setItem('duty_user', JSON.stringify(updatedUser));
    } else if (!user.lastReportMonth) {
      const updatedUser = { ...user, lastReportMonth: currentMonthKey };
      setUser(updatedUser);
      localStorage.setItem('duty_user', JSON.stringify(updatedUser));
    }
  }, [user, isLoaded]);

  const generateAndDownloadReport = () => {
    if (!user) return;
    const reportData = `
تقرير الدوام الشهري - ${user.jobTitle} ${user.name}
الشهر: ${user.lastReportMonth}
----------------------------------
سجلات الحضور:
${attendance.map(a => `- التاريخ: ${a.date} | الحالة: ${a.status === 'work' ? 'دوام' : 'إجازة'}`).join('\n')}

سجلات الإضافي (Overtime):
${overtime.map(o => `- التاريخ: ${o.date} | الساعات: ${o.hours} | التفاصيل: ${o.description}`).join('\n')}
----------------------------------
تم التوليد بواسطة تطبيق المهندس الفني الذكي.
    `;
    
    const blob = new Blob([reportData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${user.lastReportMonth}_${user.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveUser = (data: UserData) => {
    localStorage.setItem('duty_user', JSON.stringify(data));
    setUser(data);
  };

  const handleLogAttendance = (record: AttendanceRecord) => {
    const updated = [...attendance, record];
    const lastIndices = new Map<string, number>();
    updated.forEach((v, i) => lastIndices.set(v.date, i));
    const unique = updated.filter((v, i) => lastIndices.get(v.date) === i);
    localStorage.setItem('duty_attendance', JSON.stringify(unique));
    setAttendance(unique);
  };

  const handleAddOvertime = (record: OvertimeRecord) => {
    const updated = [...overtime, record];
    localStorage.setItem('duty_overtime', JSON.stringify(updated));
    setOvertime(updated);
  };

  const toggleTheme = () => {
    if (!user) return;
    const newTheme: AppTheme = user.theme === 'ليلي' ? 'نهاري' : 'ليلي';
    const updatedUser = { ...user, theme: newTheme };
    setUser(updatedUser);
    localStorage.setItem('duty_user', JSON.stringify(updatedUser));
  };

  if (!isLoaded) return null;
  if (!user) return <Onboarding onSave={handleSaveUser} />;

  return (
    <Layout currentView={currentView} setView={setCurrentView} user={user} onToggleTheme={toggleTheme}>
      {currentView === 'dashboard' && <Dashboard user={user} />}
      {currentView === 'attendance' && (
        <Attendance user={user} records={attendance} onLog={handleLogAttendance} />
      )}
      {currentView === 'overtime' && (
        <Overtime records={overtime} onAdd={handleAddOvertime} theme={user.theme} />
      )}
      {currentView === 'calendar' && <CalendarView user={user} />}
      {currentView === 'reports' && (
        <Reports user={user} records={attendance} overtime={overtime} />
      )}
    </Layout>
  );
};

export default App;
