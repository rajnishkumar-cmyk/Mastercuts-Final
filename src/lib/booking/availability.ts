// Deterministic mock availability: identical slots per date across reloads.
// Salon hours: 10:00 – 20:00. Minimum lead time: 60 min from "now".

const OPEN_HOUR = 10;
const CLOSE_HOUR = 20;
const SLOT_STEP_MIN = 30;

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// QA override — when `?qa=full` is present in the URL, every slot is marked
// unavailable and every therapist is flagged busy. Used to demo and verify
// the waitlist flow without hunting for a naturally-full date.
function isQaFullMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return new URLSearchParams(window.location.search).get('qa') === 'full';
  } catch {
    return false;
  }
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export interface TimeSlot {
  time: string;           // "10:30"
  label: string;          // "10:30 AM"
  minutesFromOpen: number;
  available: boolean;
}

function formatTime(hour: number, min: number): { time: string; label: string } {
  const hh = String(hour).padStart(2, '0');
  const mm = String(min).padStart(2, '0');
  const time = `${hh}:${mm}`;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const label = `${displayHour}:${mm} ${period}`;
  return { time, label };
}

// Returns 30-min granularity slots for a given date, filtered so there is
// enough contiguous time left in the day for `totalDurationMin`.
export function getSlotsForDate(dateKey: string, totalDurationMin: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const seed = hashString(dateKey);
  const qaFull = isQaFullMode();

  const now = new Date();
  const todayKey = toDateKey(now);
  const isToday = dateKey === todayKey;
  const leadMs = 60 * 60 * 1000;

  for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
    for (let min = 0; min < 60; min += SLOT_STEP_MIN) {
      const minutesFromOpen = (hour - OPEN_HOUR) * 60 + min;
      const minutesUntilClose = (CLOSE_HOUR - OPEN_HOUR) * 60 - minutesFromOpen;
      if (minutesUntilClose < totalDurationMin) continue;

      // Deterministic "busy" pattern — ~30% of slots unavailable.
      // QA override forces every slot to unavailable.
      const slotSeed = (seed + minutesFromOpen * 17) % 100;
      let available = qaFull ? false : slotSeed > 30;

      if (isToday) {
        const [Y, M, D] = dateKey.split('-').map(Number);
        const slotDate = new Date(Y, M - 1, D, hour, min, 0, 0);
        if (slotDate.getTime() - now.getTime() < leadMs) available = false;
      }

      const { time, label } = formatTime(hour, min);
      slots.push({ time, label, minutesFromOpen, available });
    }
  }
  return slots;
}

export function groupSlotsByPeriod(slots: TimeSlot[]): {
  morning: TimeSlot[];
  afternoon: TimeSlot[];
  evening: TimeSlot[];
} {
  return {
    morning: slots.filter((s) => {
      const h = Number(s.time.split(':')[0]);
      return h < 12;
    }),
    afternoon: slots.filter((s) => {
      const h = Number(s.time.split(':')[0]);
      return h >= 12 && h < 17;
    }),
    evening: slots.filter((s) => {
      const h = Number(s.time.split(':')[0]);
      return h >= 17;
    }),
  };
}

// For any given date, is the salon closed? Mock: closed Sundays.
export function isDateClosed(d: Date): boolean {
  return d.getDay() === 0;
}

export function isDatePast(d: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

// Mock per-therapist day-busy lookup. Deterministic across reloads so the
// demo is stable. ~25% of (therapist, date) combinations are flagged "busy".
// Real per-therapist scheduling lives on the backend later.
// `?qa=full` forces every therapist to read as busy regardless of date.
export function isTherapistBusyOnDate(
  therapistId: string,
  dateKey: string
): boolean {
  if (isQaFullMode()) return true;
  const h = hashString(`${therapistId}::${dateKey}`);
  return h % 100 < 25;
}
