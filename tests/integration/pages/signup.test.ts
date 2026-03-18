import orchestrator from 'tests/orchestrator';

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('GET /signup', () => {
  it('deve exibir a página de cadastro para usuário não autenticado', async () => {
    const response = await fetch('http://localhost:3000/signup', {
      redirect: 'manual',
    });

    expect(response.status).toBe(200);
  });

  it('deve redirecionar para /dates quando usuário está autenticado', async () => {
    const cookie = await orchestrator.createAuthCookie();

    const response = await fetch('http://localhost:3000/signup', {
      redirect: 'manual',
      headers: { Cookie: cookie },
    });

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/dates');
  });
});
