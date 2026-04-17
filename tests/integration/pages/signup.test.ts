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

  it('deve redirecionar para next quando usuário autenticado e next é válido', async () => {
    const cookie = await orchestrator.createAuthCookie();

    const response = await fetch(
      'http://localhost:3000/signup?next=%2Fjoin-group%3Fcode%3Dabc',
      {
        redirect: 'manual',
        headers: { Cookie: cookie },
      },
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/join-group?code=abc');
  });

  it('deve redirecionar para /dates quando next começa com /api/', async () => {
    const cookie = await orchestrator.createAuthCookie();

    const response = await fetch(
      'http://localhost:3000/signup?next=%2Fapi%2Fv1%2Fusers',
      {
        redirect: 'manual',
        headers: { Cookie: cookie },
      },
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/dates');
  });
});
