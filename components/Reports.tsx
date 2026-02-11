
import React from 'react';
import { UserData, AttendanceRecord, OvertimeRecord } from '../types';
import { Briefcase, Clock, Activity, FileText } from 'lucide-react';

interface ReportsProps {
  user: UserData;
  records: AttendanceRecord[];
  overtime: OvertimeRecord[];
}

const Reports: React.FC<ReportsProps> = ({ user, records, overtime }) => {
  const isNight = user.theme === 'ليلي';
  const totalOT = overtime.reduce((sum, r) => sum + r.hours, 0);
  const workDays = records.length;
  const totalHours = (workDays * 24) + totalOT;

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500 text-right">
      <div className={`${isNight ? 'bg-slate-900' : 'bg-indigo-950'} p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden`}>
        <h2 className="text-3xl font-black mb-1">ملخص الأداء</h2>
        <p className="text-indigo-400 font-bold">الشهر الحالي • {new Date().toLocaleDateString('ar-EG', { month: 'long' })}</p>
        <FileText size={100} className="absolute -right-8 -bottom-8 opacity-5" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatItem icon={<Briefcase className="text-indigo-500" />} label="أيام الدوام" value={workDays} unit="يوم" isNight={isNight} />
        <StatItem icon={<Clock className="text-amber-500" />} label="إضافي (OT)" value={totalOT} unit="ساعة" isNight={isNight} />
        <StatItem icon={<Activity className="text-emerald-500" />} label="إجمالي الساعات" value={totalHours} unit="ساعة" isNight={isNight} />
        <StatItem icon={<FileText className="text-indigo-500" />} label="اللقب المهني" value={user.jobTitle} unit="" isNight={isNight} />
      </div>

      <div className="bg-indigo-600 p-6 rounded-[2rem] text-white">
        <h3 className="font-black mb-2">ملاحظة التقرير</h3>
        <p className="text-xs text-white/70 leading-relaxed font-bold">
          سيتم توليد التقرير النهائي تلقائياً وتحميله على جهازك في منتصف ليلة اليوم الأخير من الشهر. تأكد من تسجيل كافة ساعاتك الإضافية قبل ذلك.
        </p>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit: string; isNight: boolean }> = ({ icon, label, value, unit, isNight }) => (
  <div className={`p-5 rounded-2xl border shadow-sm flex flex-col items-center ${isNight ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
    <div className="mb-2">{icon}</div>
    <p className="text-[10px] font-black text-slate-400">{label}</p>
    <p className={`text-xl font-black ${isNight ? 'text-slate-100' : 'text-slate-800'}`}>{value} <span className="text-[10px]">{unit}</span></p>
  </div>
);

export default Reports;
