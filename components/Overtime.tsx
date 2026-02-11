
import React, { useState } from 'react';
import { OvertimeRecord } from '../types';
import { Plus, Clock, History } from 'lucide-react';

interface OvertimeProps {
  records: OvertimeRecord[];
  onAdd: (record: OvertimeRecord) => void;
  isNight?: boolean;
}

const Overtime: React.FC<{ records: OvertimeRecord[]; onAdd: (record: OvertimeRecord) => void; theme?: 'نهاري' | 'ليلي' }> = ({ records, onAdd, theme }) => {
  const [hours, setHours] = useState<number>(1);
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const isNight = theme === 'ليلي';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      date,
      hours,
      description: desc
    });
    setHours(1);
    setDesc('');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500 text-right">
      <div className={`p-6 rounded-[2rem] shadow-xl border ${isNight ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
        <h3 className={`text-xl font-black mb-4 flex items-center gap-2 ${isNight ? 'text-slate-200' : 'text-slate-800'}`}>
          <Plus className="text-indigo-500" /> تسجيل عمل إضافي (OT)
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 mr-1 uppercase">التاريخ</label>
              <input type="date" required className={`w-full p-3 border rounded-xl font-bold ${isNight ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 mr-1 uppercase">الساعات</label>
              <input type="number" step="0.5" min="0.5" required className={`w-full p-3 border rounded-xl font-bold ${isNight ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} value={hours} onChange={e => setHours(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 mr-1 uppercase">وصف العمل المنجز</label>
            <textarea className={`w-full p-3 border rounded-xl h-20 resize-none font-medium ${isNight ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} placeholder="ماذا فعلت في الساعات الإضافية؟" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <button type="submit" className={`${isNight ? 'bg-indigo-700' : 'bg-indigo-600'} w-full text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2`}>
            إضافة لسجل الشهر
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className={`text-lg font-black flex items-center gap-2 px-2 ${isNight ? 'text-slate-400' : 'text-slate-800'}`}>
          <History size={18} /> سجل الإضافي للشهر الحالي
        </h3>
        {records.length > 0 ? (
          records.slice().reverse().map(record => (
            <div key={record.id} className={`p-4 rounded-2xl shadow-sm border flex justify-between items-center ${isNight ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`${isNight ? 'bg-amber-900/30 text-amber-500' : 'bg-amber-100 text-amber-700'} p-3 rounded-xl`}><Clock size={18} /></div>
                <div>
                  <p className={`font-black ${isNight ? 'text-slate-300' : 'text-slate-800'}`}>{record.hours} ساعة إضافية</p>
                  <p className="text-[10px] text-slate-500 font-bold">{record.date}</p>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-medium italic max-w-[120px] truncate">{record.description}</div>
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-slate-500 font-bold">لا توجد ساعات إضافية مسجلة</p>
        )}
      </div>
    </div>
  );
};

export default Overtime;
