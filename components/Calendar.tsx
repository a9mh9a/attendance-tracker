
import React from 'react';
import { UserData, DutyStatus } from '../types';
import { getDutyStatusAtDate } from '../utils/dutyEngine';

interface CalendarProps {
  user: UserData;
}

const CalendarView: React.FC<CalendarProps> = ({ user }) => {
  const isNight = user.theme === 'ليلي';
  
  // Logic to get only remaining days in current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const remainingDaysCount = lastDayOfMonth - today.getDate() + 1;

  const dates = Array.from({ length: remainingDaysCount }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-500 text-right">
      <div className={`${isNight ? 'bg-slate-900 border-white/5' : 'bg-indigo-600'} p-6 rounded-3xl text-white shadow-lg mb-6 border`}>
        <h2 className="text-2xl font-black mb-1">جدول الشهر الحالي</h2>
        <p className="opacity-80 text-sm">متبقي {remainingDaysCount} يوم حتى نهاية الشهر</p>
      </div>

      <div className="space-y-2">
        {dates.map((date, idx) => {
          const status = getDutyStatusAtDate(new Date(user.startDate), date);
          const isWork = status === DutyStatus.WORK;
          const isToday = idx === 0;

          return (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl flex justify-between items-center border transition-all ${
                isToday ? (isNight ? 'ring-2 ring-indigo-500 shadow-md scale-[1.02]' : 'ring-2 ring-indigo-500 shadow-md scale-[1.02]') : 'shadow-sm'
              } ${
                isWork 
                  ? (isNight ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-emerald-50 border-emerald-100') 
                  : (isNight ? 'bg-rose-950/20 border-rose-900/50' : 'bg-rose-50 border-rose-100')
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shadow-sm ${
                  isWork 
                    ? (isNight ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white') 
                    : (isNight ? 'bg-rose-600 text-white' : 'bg-rose-500 text-white')
                }`}>
                  <span className="text-[10px] uppercase font-black leading-tight">
                    {date.toLocaleDateString('ar-EG', { month: 'short' })}
                  </span>
                  <span className="text-lg leading-tight">{date.getDate()}</span>
                </div>
                <div>
                  <h4 className={`font-black ${isNight ? 'text-slate-200' : 'text-slate-800'}`}>
                    {date.toLocaleDateString('ar-EG', { weekday: 'long' })}
                    {isToday && <span className="mr-2 text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase font-black">اليوم</span>}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold">{date.toLocaleDateString('ar-EG')}</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
                  isWork 
                    ? (isNight ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-200 text-emerald-800') 
                    : (isNight ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-200 text-rose-800')
                }`}>
                  {isWork ? 'دوام 24 ساعة' : status === DutyStatus.OFF_DAY_1 ? 'إجازة خروج' : 'إجازة راحة'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
