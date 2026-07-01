import orchestrator from 'tests/orchestrator';

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('GET /api/v1/admin/broadcast', () => {
  describe('anonymous user', () => {
    test('should return 401', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast?key=commemorative_dates',
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
        'http://localhost:3000/api/v1/admin/broadcast?key=commemorative_dates',
        { headers: { Authorization: `Bearer ${session.token}` } },
      );
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.name).toBe('UnauthorizedError');
    });
  });

  describe('authenticated admin user', () => {
    test('should return 400 when key is missing', async () => {
      const { session } = await orchestrator.createAdminUserAndSession();

      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast',
        { headers: { Authorization: `Bearer ${session.token}` } },
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.name).toBe('ValidationError');
    });

    test('should return 400 for unknown key', async () => {
      const { session } = await orchestrator.createAdminUserAndSession();

      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast?key=nonexistent_key',
        { headers: { Authorization: `Bearer ${session.token}` } },
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.name).toBe('ValidationError');
    });

    test('should return announcement and recipient count', async () => {
      const { session } = await orchestrator.createAdminUserAndSession();

      await orchestrator.createUser({ marketing_consent: true });
      await orchestrator.createUser({ marketing_consent: true });
      await orchestrator.createUser({ marketing_consent: false });

      const response = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast?key=commemorative_dates',
        { headers: { Authorization: `Bearer ${session.token}` } },
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.announcement).toBeDefined();
      expect(body.announcement.key).toBe('commemorative_dates');
      expect(typeof body.recipientCount).toBe('number');
    });

    test('should exclude users with marketing_consent=false from count', async () => {
      const { session } = await orchestrator.createAdminUserAndSession();

      const before = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast?key=commemorative_dates',
        { headers: { Authorization: `Bearer ${session.token}` } },
      );
      const beforeBody = await before.json();
      const countBefore: number = beforeBody.recipientCount;

      await orchestrator.createUser({ marketing_consent: false });

      const after = await fetch(
        'http://localhost:3000/api/v1/admin/broadcast?key=commemorative_dates',
        { headers: { Authorization: `Bearer ${session.token}` } },
      );
      const afterBody = await after.json();

      expect(afterBody.recipientCount).toBe(countBefore);
    });
  });
});
