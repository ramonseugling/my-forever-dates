import { faker } from '@faker-js/faker';
import orchestrator from 'tests/orchestrator';
import database from 'infra/database';

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('POST /api/v1/password/forgot', () => {
  it('deve retornar 200 mesmo quando e-mail não existe', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/password/forgot',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: faker.internet.email() }),
      },
    );

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toBeDefined();
  });

  it('deve retornar 200 quando e-mail existe (sem vazar informação)', async () => {
    const userBody = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'senha123',
    };

    await fetch('http://localhost:3000/api/v1/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userBody),
    });

    const response = await fetch(
      'http://localhost:3000/api/v1/password/forgot',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userBody.email }),
      },
    );

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toBeDefined();
  });

  it('deve retornar 405 para método GET', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/password/forgot',
    );

    expect(response.status).toBe(405);
  });

  describe('rate limiting', () => {
    async function createUser() {
      const userBody = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'senha123',
      };
      const res = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userBody),
      });
      const createdUser = await res.json();
      return { ...createdUser, email: userBody.email };
    }

    async function requestPasswordReset(email: string) {
      return fetch('http://localhost:3000/api/v1/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    }

    it('deve permitir até 2 requisições por hora', async () => {
      const createdUser = await createUser();

      const first = await requestPasswordReset(createdUser.email);
      expect(first.status).toBe(200);

      const second = await requestPasswordReset(createdUser.email);
      expect(second.status).toBe(200);
    });

    it('deve retornar 429 na 3ª requisição dentro de uma hora', async () => {
      const createdUser = await createUser();

      await requestPasswordReset(createdUser.email);
      await requestPasswordReset(createdUser.email);

      const third = await requestPasswordReset(createdUser.email);
      expect(third.status).toBe(429);

      const data = await third.json();
      expect(data.name).toBe('TooManyRequestsError');
    });

    it('não deve contar tokens criados há mais de 1 hora', async () => {
      const createdUser = await createUser();

      await database.query(
        `INSERT INTO password_reset_tokens (token, user_id, expires_at, created_at)
         VALUES ($1, $2, NOW() + INTERVAL '1 hour', NOW() - INTERVAL '2 hours'),
                ($3, $4, NOW() + INTERVAL '1 hour', NOW() - INTERVAL '2 hours')`,
        [
          faker.string.hexadecimal({ length: 96, prefix: '' }),
          createdUser.id,
          faker.string.hexadecimal({ length: 96, prefix: '' }),
          createdUser.id,
        ],
      );

      const response = await requestPasswordReset(createdUser.email);
      expect(response.status).toBe(200);
    });
  });
});
