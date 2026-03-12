import type { NextApiRequest, NextApiResponse } from 'next';
import controller from 'infra/controller';
import { ValidationError } from 'infra/errors';
import googleAuth from 'models/google-auth';
import session from 'models/session';

export default controller({ GET: handleGet });

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query;
  const storedState = req.cookies?.google_oauth_state;

  if (!state || !storedState || state !== storedState) {
    throw new ValidationError({
      message: 'Estado de autenticação inválido.',
      action: 'Tente fazer login com Google novamente.',
    });
  }

  if (!code || typeof code !== 'string') {
    throw new ValidationError({
      message: 'Código de autorização não fornecido.',
      action: 'Tente fazer login com Google novamente.',
    });
  }

  const accessToken = await googleAuth.exchangeCodeForTokens(code);
  const profile = await googleAuth.getUserProfile(accessToken);
  const user = await googleAuth.findOrCreateUser(profile);
  const createdSession = await session.createForUser(user);

  const maxAge = 60 * 60 * 24 * 30; // 30 dias

  res.setHeader('Set-Cookie', [
    `session_token=${createdSession.token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}`,
    `google_oauth_state=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
  ]);

  res.redirect(302, '/dates');
}
