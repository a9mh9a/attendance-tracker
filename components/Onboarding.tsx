
import React, { useState, useRef } from 'react';
import { UserData, JobTitle } from '../types';
import { User, Save, Plus } from 'lucide-react';

interface OnboardingProps {
  onSave: (data: UserData) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState<JobTitle>('المهندس');
  const [startDate, setStartDate] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && startDate) {
      // Default theme to Light (نهاري) on first setup
      onSave({ name, jobTitle, startDate, profileImage, theme: 'نهاري' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-right font-sans" dir="rtl">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4 group">
            <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-indigo-500 cursor-pointer transition-all shadow-lg">
              {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-slate-300" />}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full border-2 border-white shadow-md hover:bg-indigo-700 transition-colors"><Plus size={14} /></button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">إنشاء الملف الشخصي</h2>
          <p className="text-slate-400 text-sm font-bold">تخصيص نظام المهندس الفني الذكي</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 mr-1 uppercase">الاسم الكامل</label>
            <input type="text" required className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 mr-1 uppercase">المسمى الوظيفي</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setJobTitle('المهندس')} className={`p-3.5 rounded-2xl border-2 font-black transition-all ${jobTitle === 'المهندس' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}>المهندس</button>
              <button type="button" onClick={() => setJobTitle('الفني')} className={`p-3.5 rounded-2xl border-2 font-black transition-all ${jobTitle === 'الفني' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}>الفني</button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 mr-1 uppercase">تاريخ المباشرة</label>
            <input type="date" required className="w-full p-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white font-black py-4.5 rounded-2xl shadow-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-black mt-2"><Save size={20} /> حفظ البيانات والدخول</button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
