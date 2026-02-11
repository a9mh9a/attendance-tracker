
import React from 'react';
import { UserData, AttendanceRecord, DutyStatus } from '../types';
import { getDutyStatusAtDate } from '../utils/dutyEngine';
import { CheckCircle2, History, ShieldAlert } from 'lucide-react';

interface AttendanceProps {
  user: UserData;
  records: AttendanceRecord[];
  onLog: (record: AttendanceRecord) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ user, records, onLog }) => {
  const isNight = user.theme === 'ليلي';
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const status = getDutyStatusAtDate(new Date(user.startDate), today);
  const alreadyLogged = records.some(r => r.date === dateStr);

  const handleConfirm = () => {
    if (status !== DutyStatus.WORK) {
      alert("عذراً، اليوم ليس موعد دوامك المجدول.");
      return;
    }
    onLog({
      date: dateStr,
      status: 'work',
      timestamp: Date.now()
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 text-right">
      <div className={`p-6 rounded-[2rem] shadow-md border ${isNight ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isNight ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className={`text-xl font-black ${isNight ? 'text-slate-200' : 'text-slate-800'}`}>تأكيد الدوام</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">سجل حضورك الرسمي لليوم</p>
          </div>
        </div>

        {alreadyLogged ? (
          <div className={`${isNight ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-emerald-50 border-emerald-100'} p-6 rounded-2xl border flex flex-col items-center text-center gap-2`}>
            <CheckCircle2 size={40} className="text-emerald-500" />
            <p className={`font-black ${isNight ? 'text-emerald-400' : 'text-emerald-700'}`}>تم تسجيل حضورك اليوم بنجاح!</p>
            <p className="text-[10px] text-emerald-600/70 font-bold">{dateStr}</p>
          </div>
        ) : status === DutyStatus.WORK ? (
          <button
            onClick={handleConfirm}
            className={`${isNight ? 'bg-indigo-700' : 'bg-indigo-600'} w-full text-white p-4.5 rounded-2xl font-black shadow-lg shadow-indigo-500/10 transition-transform active:scale-95 flex items-center justify-center gap-2`}
          >
            تأكيد مباشر للدوام
          </button>
        ) : (
          <div className={`${isNight ? 'bg-amber-950/20 border-amber-900/50' : 'bg-amber-50 border-amber-100'} p-6 rounded-2xl border flex items-center gap-4`}>
            <ShieldAlert className="text-amber-500 shrink-0" size={32} />
            <p className={`${isNight ? 'text-amber-300' : 'text-amber-700'} text-xs font-bold leading-relaxed`}>
              لا يمكنك تسجيل الحضور اليوم لأن جدولك يظهر أنك في فترة "إجازة".
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className={`text-lg font-black flex items-center gap-2 px-2 ${isNight ? 'text-slate-400' : 'text-slate-800'}`}>
          <History size={20} /> سجل الحضور الأخير
        </h3>
        
        <div className="space-y-3">
          {records.length > 0 ? (
            [...records].reverse().map((record, i) => (
              <div key={i} className={`p-4 rounded-2xl shadow-sm border flex justify-between items-center ${isNight ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isNight ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className={`font-black ${isNight ? 'text-slate-300' : 'text-slate-800'}`}>{new Date(record.date).toLocaleDateString('ar-EG', { weekday: 'long' })}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{record.date}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${isNight ? 'bg-emerald-900/50 text-emerald-400 border-emerald-900' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                  داومت
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 font-bold">
              <p>لا توجد سجلات حضور حتى الآن</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
