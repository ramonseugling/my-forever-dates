import orchestrator from 'tests/orchestrator';

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('GET /dates', () => {
  it('deve redirecionar para / quando usuário não está autenticado', async () => {
    const response = await fetch('http://localhost:3000/dates', {
      redirect: 'manual',
    });

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/');
  });

  it('deve exibir a página de datas quando usuário está autenticado', async () => {
    const cookie = await orchestrator.createAuthCookie();

    const response = await fetch('http://localhost:3000/dates', {
      redirect: 'manual',
      headers: { Cookie: cookie },
    });

    expect(response.status).toBe(200);
  });
});
