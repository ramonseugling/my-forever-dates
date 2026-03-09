import type { NextApiRequest, NextApiResponse } from 'next';
import controller from 'infra/controller';
import { ValidationError } from 'infra/errors';
import passwordReset from 'models/password-reset';

export default controller({
  POST: handlePost,
});

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ValidationError({
      message: 'Token e nova senha são obrigatórios.',
      action: 'Preencha todos os campos e tente novamente.',
    });
  }

  await passwordReset.resetPassword(token, password);

  res.status(200).json({ message: 'Senha redefinida com sucesso.' });
}
