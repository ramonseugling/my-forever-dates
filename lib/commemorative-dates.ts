export const COMMEMORATIVE_DATES = [
  {
    key: 'mothers_day',
    label: 'Dia das Mães',
    emoji: '💐',
    kind: 'nth_sunday',
    month: 5,
    n: 2,
  },
  {
    key: 'fathers_day',
    label: 'Dia dos Pais',
    emoji: '👔',
    kind: 'nth_sunday',
    month: 8,
    n: 2,
  },
  {
    key: 'valentines_day',
    label: 'Dia dos Namorados',
    emoji: '❤️',
    kind: 'fixed',
    day: 12,
    month: 6,
  },
  {
    key: 'childrens_day',
    label: 'Dia das Crianças',
    emoji: '🧸',
    kind: 'fixed',
    day: 12,
    month: 10,
  },
  {
    key: 'christmas',
    label: 'Natal',
    emoji: '🎄',
    kind: 'fixed',
    day: 25,
    month: 12,
  },
] as const;

export type CommemorativeKey = (typeof COMMEMORATIVE_DATES)[number]['key'];
export const COMMEMORATIVE_KEYS = COMMEMORATIVE_DATES.map(
  (d) => d.key,
) as string[];
