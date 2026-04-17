import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import controller from 'infra/controller';
import { isValidNextUrl } from 'infra/page-guard';
import googleAuth from 'models/google-auth';

export default controller({ GET: handleGet });

async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  const state = crypto.randomBytes(32).toString('hex');

  const url = googleAuth.getAuthorizationUrl(state);

  const next = typeof _req.query.next === 'string' ? _req.query.next : '';

  const cookies = [
    `google_oauth_state=${state}; HttpOnly; Path=/; SameSite=Lax; Max-Age=600`,
  ];

  if (next && isValidNextUrl(next)) {
    cookies.push(
      `google_oauth_next=${encodeURIComponent(next)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=600`,
    );
  }

  res.setHeader('Set-Cookie', cookies);

  res.redirect(302, url);
}
