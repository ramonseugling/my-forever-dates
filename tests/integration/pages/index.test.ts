import orchestrator from 'tests/orchestrator';

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('GET /', () => {
  it('deve exibir a landing page para usuário não autenticado', async () => {
    const response = await fetch('http://localhost:3000/', {
      redirect: 'manual',
    });

    expect(response.status).toBe(200);
  });

  it('deve redirecionar para /dates quando usuário está autenticado', async () => {
    const cookie = await orchestrator.createAuthCookie();

    const response = await fetch('http://localhost:3000/', {
      redirect: 'manual',
      headers: { Cookie: cookie },
    });

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/dates');
  });
});
