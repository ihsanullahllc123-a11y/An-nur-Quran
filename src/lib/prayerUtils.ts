import { parse, isAfter, addDays, format, intervalToDuration } from 'date-fns';

export interface PrayerTime {
  name: string;
  time: string;
  id: string;
}

// Helper to strip timezone info like (EEST) from Aladhan API
const cleanTime = (time: string) => {
  if (!time) return '';
  return time.split(' ')[0];
};

export const getNextPrayer = (times: any) => {
  if (!times) return null;

  const now = new Date();
  const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  for (const name of prayerNames) {
    const rawTime = times[name];
    if (!rawTime) continue;

    const timeStr = cleanTime(rawTime);
    const prayerTime = parse(timeStr, 'HH:mm', now);
    
    if (isAfter(prayerTime, now)) {
      return {
        name,
        time: timeStr,
        isNextDay: false,
        date: now
      };
    }
  }

  // If we've passed Isha or are before today's Fajr 
  // (though the loop should catch it if now is early morning)
  // Let's explicitly check if we are before Fajr
  const fajrTimeStr = cleanTime(times.Fajr);
  const fajrToday = parse(fajrTimeStr, 'HH:mm', now);
  if (isAfter(fajrToday, now)) {
    return {
      name: 'Fajr',
      time: fajrTimeStr,
      isNextDay: false,
      date: now
    };
  }

  // Otherwise, it's Fajr tomorrow
  return {
    name: 'Fajr',
    time: fajrTimeStr,
    isNextDay: true,
    date: addDays(now, 1)
  };
};

export const getTimeRemaining = (nextPrayer: any) => {
  if (!nextPrayer) return '';

  const now = new Date();
  const prayerTime = parse(nextPrayer.time, 'HH:mm', nextPrayer.date);
  
  const duration = intervalToDuration({ start: now, end: prayerTime });
  
  const parts = [];
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes !== undefined) parts.push(`${duration.minutes}m`);
  
  return parts.length > 0 ? parts.join(' ') : 'now';
};

export const formatTime12h = (time24: string) => {
  if (!time24) return '';
  const cleaned = cleanTime(time24);
  const date = parse(cleaned, 'HH:mm', new Date());
  return format(date, 'h:mm a');
};

export const PRAYER_METHODS = [
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 2, name: 'ISNA' },
  { id: 3, name: 'MWL' },
  { id: 4, name: 'Umm al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 8, name: 'Gulf Region' },
  { id: 9, name: 'Kuwait' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore' },
  { id: 12, name: 'Union des Organisations Islamiques de France' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
];
