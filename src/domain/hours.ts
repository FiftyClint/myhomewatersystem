export interface BusinessHours {
  days: number[]; // 1 = Monday ... 7 = Sunday
  start: string; // "08:00" local
  end: string; // "17:00" local
}

const WEEKDAY: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

export function localParts(at: Date, timeZone: string): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return { day: WEEKDAY[get('weekday')]!, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h! * 60 + m!;
};

export function isOpen(at: Date, timeZone: string, hours: BusinessHours): boolean {
  const { day, minutes } = localParts(at, timeZone);
  return hours.days.includes(day) && minutes >= toMinutes(hours.start) && minutes < toMinutes(hours.end);
}

// Adds business minutes in the market's timezone. DST is handled because every
// step is a real UTC instant converted to local time.
export function addBusinessMinutes(from: Date, minutes: number, timeZone: string, hours: BusinessHours): Date {
  let t = new Date(Math.floor(from.getTime() / 60000) * 60000);
  let remaining = minutes;
  for (let guard = 0; guard < 40000 && remaining > 0; guard++) {
    if (isOpen(t, timeZone, hours)) {
      t = new Date(t.getTime() + 60000);
      remaining--;
    } else {
      t = new Date(t.getTime() + 60000);
    }
  }
  return t;
}
