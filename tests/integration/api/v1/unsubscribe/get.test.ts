import orchestrator from 'tests/orchestrator';
import { makeUnsubscribeToken } from '@/lib/unsubscribe-token';
import database from 'infra/database';

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('GET /api/v1/unsubscribe', () => {
  test('should return 400 for missing token', async () => {
    const response = await fetch('http://localhost:3000/api/v1/unsubscribe');
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.name).toBe('ValidationError');
  });

  test('should return 400 for invalid token', async () => {
    const response = await fetch(
      'http://localhost:3000/api/v1/unsubscribe?token=invalid-token',
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.name).toBe('ValidationError');
  });

  test('should set marketing_consent=false for valid token', async () => {
    const user = await orchestrator.createUser({ marketing_consent: true });
    const token = makeUnsubscribeToken(user.id);

    const response = await fetch(
      `http://localhost:3000/api/v1/unsubscribe?token=${encodeURIComponent(token)}`,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');

    const updated = await database.query(
      `SELECT marketing_consent FROM users WHERE id = $1`,
      [user.id],
    );
    expect(updated.rows[0].marketing_consent).toBe(false);
  });

  test('should be idempotent (second call still returns 200)', async () => {
    const user = await orchestrator.createUser({ marketing_consent: true });
    const token = makeUnsubscribeToken(user.id);
    const url = `http://localhost:3000/api/v1/unsubscribe?token=${encodeURIComponent(token)}`;

    await fetch(url);
    const response = await fetch(url);

    expect(response.status).toBe(200);

    const updated = await database.query(
      `SELECT marketing_consent FROM users WHERE id = $1`,
      [user.id],
    );
    expect(updated.rows[0].marketing_consent).toBe(false);
  });
});
