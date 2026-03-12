import { UnauthorizedError } from 'infra/errors';
import password from 'models/password';
import user from 'models/user';

async function getAuthenticatedUser(
  providedEmail: string,
  providedPassword: string,
) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof GoogleAccountError) {
      throw error;
    }

    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: 'Dados de autenticação não conferem.',
        action: 'Verifique se os dados enviados estão corretos.',
      });
    }

    throw error;
  }

  async function findUserByEmail(email: string) {
    const storedUser = await user.findOneByEmail(email);

    if (!storedUser) {
      throw new UnauthorizedError({
        message: 'E-mail não confere.',
        action: 'Verifique se este dado está correto.',
      });
    }

    return storedUser;
  }

  async function validatePassword(provided: string, stored: string | null) {
    if (!stored) {
      throw new GoogleAccountError();
    }

    const match = await password.compare(provided, stored);

    if (!match) {
      throw new UnauthorizedError({
        message: 'Senha não confere.',
        action: 'Verifique se este dado está correto.',
      });
    }
  }
}

class GoogleAccountError extends UnauthorizedError {
  constructor() {
    super({
      message: 'Esta conta usa login com Google.',
      action: 'Use o botão "Continuar com Google" para entrar.',
    });
  }
}

const authentication = { getAuthenticatedUser };

export default authentication;
