
export type JobTitle = 'المهندس' | 'الفني';
export type AppTheme = 'نهاري' | 'ليلي';

export interface OvertimeRecord {
  id: string;
  date: string;
  hours: number;
  description: string;
}

export interface UserData {
  name: string;
  jobTitle: JobTitle;
  startDate: string; 
  profileImage?: string;
  theme: AppTheme;
  lastReportMonth?: string; // YYYY-MM
}

export interface AttendanceRecord {
  date: string;
  status: 'work' | 'off';
  timestamp: number;
}

export enum DutyStatus {
  WORK = 'work',
  OFF_DAY_1 = 'off1',
  OFF_DAY_2 = 'off2'
}

export type ViewType = 'dashboard' | 'attendance' | 'overtime' | 'calendar' | 'reports';
