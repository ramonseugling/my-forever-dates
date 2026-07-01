import crypto from 'crypto';

function getSecret(): string {
  return process.env.UNSUBSCRIBE_SECRET ?? process.env.CRON_SECRET ?? '';
}

export function makeUnsubscribeToken(userId: string): string {
  const hmac = crypto
    .createHmac('sha256', getSecret())
    .update(userId)
    .digest('hex');
  return `${userId}.${hmac}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const userId = token.slice(0, dotIndex);
  const provided = token.slice(dotIndex + 1);

  if (!userId) return null;

  const expected = crypto
    .createHmac('sha256', getSecret())
    .update(userId)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'hex');
  const providedBuf = Buffer.from(provided, 'hex');

  if (expectedBuf.length !== providedBuf.length) return null;

  if (!crypto.timingSafeEqual(expectedBuf, providedBuf)) return null;

  return userId;
}
