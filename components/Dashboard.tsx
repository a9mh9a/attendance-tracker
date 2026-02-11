
import React, { useState, useEffect } from 'react';
import { UserData, DutyStatus } from '../types';
import { getDutyStatusAtDate, getTimeRemaining } from '../utils/dutyEngine';
import { Calendar as CalIcon, Compass } from 'lucide-react';

interface DashboardProps {
  user: UserData;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [status, setStatus] = useState<DutyStatus>(DutyStatus.OFF_DAY_2);
  const [daysToEndMonth, setDaysToEndMonth] = useState(0);
  const [countdown, setCountdown] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const isNight = user.theme === 'ليلي';

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const start = new Date(user.startDate);
      
      const currentStatus = getDutyStatusAtDate(start, now);
      setStatus(currentStatus);
      setCountdown(getTimeRemaining(start, now));
      
      // Calculate days until report (last day of month)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const diff = lastDay.getDate() - now.getDate();
      setDaysToEndMonth(Math.max(0, diff));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [user]);

  const isWorking = status === DutyStatus.WORK;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-right">
      {/* Primary Status Card */}
      <div className={`p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all ${
        isWorking 
          ? (isNight ? 'bg-indigo-900 border-indigo-800' : 'bg-indigo-600') 
          : (isNight ? 'bg-slate-900 border-slate-800' : 'bg-slate-800')
      } border`}>
        <div className="relative z-10 flex flex-col gap-2">
          <div className="bg-white/10 w-fit p-3 rounded-2xl backdrop-blur-md">
            {isWorking ? <Compass className="text-white animate-spin-slow" size={28} /> : <CalIcon className="text-white" size={28} />}
          </div>
          <h2 className="text-3xl font-black text-white">
            {isWorking ? 'نوبة عمل نشطة' : status === DutyStatus.OFF_DAY_1 ? 'إجازة خروج' : 'إجازة راحة'}
          </h2>
          <p className="text-white/70 font-bold">النظام: <span className="text-white">24 ساعة (تبدأ 7:00 ص)</span></p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Countdown Timer */}
      <div className={`p-6 rounded-[2rem] shadow-xl border transition-colors ${isNight ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'} text-center`}>
        <h3 className="text-slate-400 font-black text-xs uppercase mb-4 tracking-widest">
          {isWorking ? 'الوقت المتبقي لتسليم النوبة' : 'الوقت المتبقي للاستلام القادم'}
        </h3>
        <div className="flex justify-center gap-4" dir="ltr">
          <TimeUnit value={countdown.hours} label="ساعة" isNight={isNight} />
          <TimeUnit value={countdown.minutes} label="دقيقة" isNight={isNight} />
          <TimeUnit value={countdown.seconds} label="ثانية" isNight={isNight} />
        </div>
      </div>

      {/* Monthly Progress */}
      <div className={`p-6 rounded-[2rem] border flex items-center justify-between transition-colors ${
        isNight ? 'bg-indigo-950/30 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100'
      }`}>
        <div>
          <h4 className={`font-black text-lg ${isNight ? 'text-indigo-300' : 'text-indigo-900'}`}>نهاية الدورة الشهرية</h4>
          <p className={`${isNight ? 'text-indigo-400/80' : 'text-indigo-600'} text-sm font-bold`}>متبقي {daysToEndMonth} يوم على تقريرك</p>
        </div>
        <div className={`${isNight ? 'bg-indigo-700' : 'bg-indigo-600'} text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg`}>
          {daysToEndMonth}
        </div>
      </div>

      {/* Bottom Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl shadow-sm border ${isNight ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
          <p className="text-[10px] font-black text-slate-400 mb-1">تاريخ المباشرة</p>
          <p className={`font-black text-sm ${isNight ? 'text-slate-200' : 'text-slate-800'}`}>{user.startDate}</p>
        </div>
        <div className={`p-4 rounded-2xl shadow-sm border ${isNight ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
          <p className="text-[10px] font-black text-slate-400 mb-1">ساعة الاستلام</p>
          <p className={`font-black text-sm ${isNight ? 'text-slate-200' : 'text-slate-800'}`}>07:00 صباحاً</p>
        </div>
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: string; label: string; isNight: boolean }> = ({ value, label, isNight }) => (
  <div className="flex flex-col items-center">
    <div className={`${isNight ? 'bg-slate-800 text-indigo-400' : 'bg-slate-900 text-white'} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg mb-1`}>{value}</div>
    <span className="text-[9px] font-black text-slate-500 uppercase">{label}</span>
  </div>
);

export default Dashboard;
