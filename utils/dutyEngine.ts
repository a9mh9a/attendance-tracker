
import { DutyStatus } from '../types';

/**
 * Calculates the current status based on the start date at 07:00 AM.
 * Cycle: 24h Work, 48h Off.
 */
export const getDutyStatusAtDate = (startDate: Date, targetDate: Date): DutyStatus => {
  // Normalize start date to 07:00 AM
  const start = new Date(startDate);
  start.setHours(7, 0, 0, 0);
  
  const target = new Date(targetDate);

  const diffTime = target.getTime() - start.getTime();
  
  // A full cycle is 3 days (72 hours)
  const cycleMs = 3 * 24 * 60 * 60 * 1000;
  const dayMs = 24 * 60 * 60 * 1000;

  // Handle dates before the start date
  if (diffTime < 0) {
    // If before start, we calculate backwards or just assume off
    return DutyStatus.OFF_DAY_2;
  }

  const msInCycle = diffTime % cycleMs;
  
  if (msInCycle < dayMs) return DutyStatus.WORK;
  if (msInCycle < 2 * dayMs) return DutyStatus.OFF_DAY_1;
  return DutyStatus.OFF_DAY_2;
};

export const getTimeRemaining = (startDate: Date, targetDate: Date) => {
  const start = new Date(startDate);
  start.setHours(7, 0, 0, 0);
  
  const target = new Date(targetDate);
  const diffTime = target.getTime() - start.getTime();
  
  const cycleMs = 3 * 24 * 60 * 60 * 1000;
  const dayMs = 24 * 60 * 60 * 1000;
  
  const status = getDutyStatusAtDate(startDate, targetDate);
  const msInCycle = diffTime % cycleMs;

  let remainingMs = 0;

  if (status === DutyStatus.WORK) {
    // Countdown until the end of this 24h shift (which is at 7 AM tomorrow)
    remainingMs = dayMs - msInCycle;
  } else {
    // Countdown until the start of the NEXT cycle (which is at 7 AM of the next work day)
    remainingMs = cycleMs - msInCycle;
  }

  return formatDuration(remainingMs);
};

const formatDuration = (ms: number) => {
  if (ms < 0) ms = 0;
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  };
};
