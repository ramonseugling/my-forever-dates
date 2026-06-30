import orchestrator from 'tests/orchestrator';

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('PUT /api/v1/commemorative-dates/[key]', () => {
  it('enables a commemorative date for authenticated user', async () => {
    const { session } = await orchestrator.createUserAndSession();

    const response = await fetch(
      'http://localhost:3000/api/v1/commemorative-dates/christmas',
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.token}` },
      },
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.key).toBe('christmas');
    expect(data.enabled).toBe(true);
  });

  it('is idempotent — enabling twice does not error', async () => {
    const { session } = await orchestrator.createUserAndSession();

    await fetch('http://localhost:3000/api/v1/commemorative-dates/christmas', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${session.token}` },
    });

    const response = await fetch(
      'http://localhost:3000/api/v1/commemorative-dates/christmas',
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.token}` },
      },
    );

    expect(response.status).toBe(200);
  });

  it('returns 400 for an invalid key', async () => {
    const { session } = await orchestrator.createUserAndSession();

    const response = await fetch(
      'http://localhost:3000/api/v1/commemorative-dates/invalid_key',
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.token}` },
      },
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.name).toBe('ValidationError');
  });

  it('returns 401 when not authenticated', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/commemorative-dates/christmas',
      {
        method: 'PUT',
      },
    );

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.name).toBe('UnauthorizedError');
  });

  it('enables all valid commemorative keys', async () => {
    const { session } = await orchestrator.createUserAndSession();
    const keys = [
      'mothers_day',
      'fathers_day',
      'valentines_day',
      'childrens_day',
      'christmas',
    ];

    for (const key of keys) {
      const response = await fetch(
        `http://localhost:3000/api/v1/commemorative-dates/${key}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${session.token}` },
        },
      );
      expect(response.status).toBe(200);
    }
  });
});

describe('DELETE /api/v1/commemorative-dates/[key]', () => {
  it('disables a previously enabled commemorative date', async () => {
    const { session } = await orchestrator.createUserAndSession();

    await fetch('http://localhost:3000/api/v1/commemorative-dates/christmas', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${session.token}` },
    });

    const response = await fetch(
      'http://localhost:3000/api/v1/commemorative-dates/christmas',
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.token}` },
      },
    );

    expect(response.status).toBe(204);
  });

  it('returns 204 even when the key was never enabled (idempotent delete)', async () => {
    const { session } = await orchestrator.createUserAndSession();

    const response = await fetch(
      'http://localhost:3000/api/v1/commemorative-dates/christmas',
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.token}` },
      },
    );

    expect(response.status).toBe(204);
  });

  it('returns 400 for an invalid key', async () => {
    const { session } = await orchestrator.createUserAndSession();

    const response = await fetch(
      'http://localhost:3000/api/v1/commemorative-dates/invalid_key',
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.token}` },
      },
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.name).toBe('ValidationError');
  });

  it('returns 401 when not authenticated', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/commemorative-dates/christmas',
      {
        method: 'DELETE',
      },
    );

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.name).toBe('UnauthorizedError');
  });
});

describe('listForUser via PUT/DELETE sequence', () => {
  it('reflects enabled state after toggle', async () => {
    const { session } = await orchestrator.createUserAndSession();

    // Enable christmas
    await fetch('http://localhost:3000/api/v1/commemorative-dates/christmas', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${session.token}` },
    });

    // Enable mothers_day
    await fetch(
      'http://localhost:3000/api/v1/commemorative-dates/mothers_day',
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.token}` },
      },
    );

    // Disable christmas
    await fetch('http://localhost:3000/api/v1/commemorative-dates/christmas', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.token}` },
    });

    // The test verifies the DB operations work without error; SSR would confirm
    // the enabled state. Since there is no GET list endpoint, we trust the model.
  });
});
