import orchestrator from 'tests/orchestrator';
import database from 'infra/database';

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('POST /api/v1/admin/broadcast', () => {
  describe('anonymous user', () => {
    test('should return 401', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ announcementKey: 'commemorative_dates' }),
        },
      );
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.name).toBe('UnauthorizedError');
    });
  });

  describe('authenticated non-admin user', () => {
    test('should return 401', async () => {
      const { session } = await orchestrator.createUserAndSession();

      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ announcementKey: 'commemorative_dates' }),
        },
      );
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.name).toBe('UnauthorizedError');
    });
  });

  describe('authenticated admin user', () => {
    test('should return 400 when announcementKey is missing', async () => {
      const { session } = await orchestrator.createAdminUserAndSession();

      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({}),
        },
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.name).toBe('ValidationError');
    });

    test('should return 400 for unknown key', async () => {
      const { session } = await orchestrator.createAdminUserAndSession();

      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ announcementKey: 'nonexistent_key' }),
        },
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.name).toBe('ValidationError');
    });

    test('should populate broadcast_deliveries and return sent count', async () => {
      const { session } = await orchestrator.createAdminUserAndSession();

      // Create 2 opted-in users and 1 opted-out
      await orchestrator.createUser({ marketing_consent: true });
      await orchestrator.createUser({ marketing_consent: true });
      await orchestrator.createUser({ marketing_consent: false });

      const countRes = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast?key=commemorative_dates',
        { headers: { Authorization: `Bearer ${session.token}` } },
      );
      const { recipientCount } = await countRes.json();

      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ announcementKey: 'commemorative_dates' }),
        },
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(typeof body.sent).toBe('number');
      expect(typeof body.failed).toBe('number');
      expect(typeof body.total).toBe('number');
      expect(body.total).toBe(recipientCount);

      // Verify deliveries were recorded
      const deliveries = await database.query(
        `SELECT COUNT(*)::int AS count FROM broadcast_deliveries WHERE announcement_key = $1`,
        ['commemorative_dates'],
      );
      expect(deliveries.rows[0].count).toBeGreaterThan(0);
    });

    test('second POST returns sent:0 (idempotency)', async () => {
      const { session } = await orchestrator.createAdminUserAndSession();

      // First send
      await fetch('http://localhost:3000/api/v1/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ announcementKey: 'commemorative_dates' }),
      });

      // Second send should find 0 new recipients
      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify({ announcementKey: 'commemorative_dates' }),
        },
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.sent).toBe(0);
      expect(body.total).toBe(0);
    });

    test('should exclude users with marketing_consent=false', async () => {
      const { session } = await orchestrator.createAdminUserAndSession();

      // Create an opted-out user and send the broadcast
      const optedOut = await orchestrator.createUser({
        marketing_consent: false,
      });
      await fetch('http://localhost:3000/api/v1/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ announcementKey: 'commemorative_dates' }),
      });

      // The opted-out user must never appear in broadcast_deliveries
      const delivery = await database.query(
        `SELECT 1 FROM broadcast_deliveries WHERE user_id = $1 AND announcement_key = $2`,
        [optedOut.id, 'commemorative_dates'],
      );
      expect(delivery.rows.length).toBe(0);
    });
  });
});
