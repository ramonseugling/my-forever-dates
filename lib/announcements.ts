export const ANNOUNCEMENTS = [
  {
    key: 'commemorative_dates',
    subject: 'Já chegou no Dia das Mães sem ter comprado nada? 😬',
    heroLabel: 'Rememberly te ajuda',
    heroTitle: 'Nunca mais perca uma data comemorativa',
    body: [
      'Seja sincero: alguma vez você chegou no Dia das Mães (ou dos Pais, ou dos Namorados) e percebeu, no próprio dia, que não tinha preparado nada? Sacanagem, né?',
      'A correria toma conta e essas datas passam batido — aí sobra aquele aperto de última hora.',
      'Por isso criamos os lembretes de datas comemorativas: avisamos com 7 dias de antecedência sobre Dia das Mães, Dia dos Pais, Namorados, Crianças e Natal. Tempo de sobra pra preparar algo com calma.',
      'É opcional e você escolhe quais datas quer receber. Leva 10 segundos pra ativar.',
    ],
    ctaLabel: 'Ativar meus lembretes',
    ctaPath: '/commemorative-dates',
  },
] as const;

export type AnnouncementKey = (typeof ANNOUNCEMENTS)[number]['key'];

export type Announcement = (typeof ANNOUNCEMENTS)[number];

export function getAnnouncement(key: string): Announcement | undefined {
  return ANNOUNCEMENTS.find((a) => a.key === key);
}

export const ANNOUNCEMENT_KEYS = ANNOUNCEMENTS.map((a) => a.key) as string[];
