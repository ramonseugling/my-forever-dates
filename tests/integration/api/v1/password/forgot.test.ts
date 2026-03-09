import { faker } from '@faker-js/faker';
import orchestrator from 'tests/orchestrator';

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
});
