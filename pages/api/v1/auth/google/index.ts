import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import controller from 'infra/controller';
import googleAuth from 'models/google-auth';

export default controller({ GET: handleGet });

async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  const state = crypto.randomBytes(32).toString('hex');

  const url = googleAuth.getAuthorizationUrl(state);

  res.setHeader(
    'Set-Cookie',
    `google_oauth_state=${state}; HttpOnly; Path=/; SameSite=Lax; Max-Age=600`,
  );

  res.redirect(302, url);
}
