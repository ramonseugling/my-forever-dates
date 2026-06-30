import {
  COMMEMORATIVE_DATES,
  type CommemorativeKey,
} from '@/lib/commemorative-dates';

const WEEKDAYS = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

export function getToday(): Date {
  const override = process.env.DEMO_TODAY;
  if (override) {
    const [year, month, day] = override.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .split('-')
    .map(Number);
  return new Date(year, month - 1, day);
}

export interface BirthdayDateInfo {
  daysUntil: number | null;
  isNextYear: boolean;
  weekday: string;
}

export function getBirthdayDateInfo(
  birth_day: number | null,
  birth_month: number | null,
): BirthdayDateInfo {
  const { daysUntil, isNextYear } = getBirthdayInfo(birth_day, birth_month);
  if (daysUntil === null) return { daysUntil: null, isNextYear, weekday: '' };

  const target = getToday();
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + daysUntil);

  return { daysUntil, isNextYear, weekday: WEEKDAYS[target.getDay()] };
}

export function getBirthdayInfo(
  birth_day: number | null,
  birth_month: number | null,
): { daysUntil: number | null; isNextYear: boolean } {
  if (!birth_day || !birth_month) return { daysUntil: null, isNextYear: false };

  const today = getToday();
  today.setHours(0, 0, 0, 0);

  const thisYear = today.getFullYear();
  const thisYearBirthday = new Date(thisYear, birth_month - 1, birth_day);
  thisYearBirthday.setHours(0, 0, 0, 0);

  const isNextYear = thisYearBirthday < today;
  const nextBirthday = isNextYear
    ? new Date(thisYear + 1, birth_month - 1, birth_day)
    : thisYearBirthday;

  const daysUntil = Math.round(
    (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return { daysUntil, isNextYear };
}

export function getDaysUntilBirthday(
  birth_day: number | null,
  birth_month: number | null,
): number | null {
  return getBirthdayInfo(birth_day, birth_month).daysUntil;
}

// Returns the date of the n-th Sunday of the given month and year (n is 1-indexed).
export function nthSundayOfMonth(year: number, month: number, n: number): Date {
  // month is 1-indexed
  const firstOfMonth = new Date(year, month - 1, 1);
  const firstSunday = (7 - firstOfMonth.getDay()) % 7;
  const dayOfMonth = firstSunday + 1 + (n - 1) * 7;
  return new Date(year, month - 1, dayOfMonth);
}

// Returns the calendar date of a commemorative date for a given year.
export function getCommemorativeDate(
  key: CommemorativeKey,
  year: number,
): Date {
  const def = COMMEMORATIVE_DATES.find((d) => d.key === key);
  if (!def) throw new Error(`Unknown commemorative key: ${key}`);

  if (def.kind === 'fixed') {
    return new Date(year, def.month - 1, def.day);
  }

  return nthSundayOfMonth(year, def.month, def.n);
}

export function formatDaysLabel(days: number): string {
  if (days === 0) return 'Hoje! 🎉';
  if (days === 1) return 'Amanhã';
  if (days <= 7) return `Em ${days} dias`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `Em ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }
  const months = Math.round(days / 30);
  return `Em ${months} ${months === 1 ? 'mês' : 'meses'}`;
}
