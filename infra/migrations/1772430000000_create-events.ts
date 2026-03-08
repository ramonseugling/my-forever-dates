import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('events', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: {
      type: 'text',
      notNull: true,
    },
    type: {
      type: 'text',
      notNull: true,
    },
    event_day: {
      type: 'smallint',
      notNull: true,
    },
    event_month: {
      type: 'smallint',
      notNull: true,
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint(
    'events',
    'events_type_check',
    `CHECK (type IN ('birthday', 'dating_anniversary', 'wedding_anniversary', 'celebration'))`,
  );

  pgm.addConstraint(
    'events',
    'events_event_day_check',
    'CHECK (event_day >= 1 AND event_day <= 31)',
  );

  pgm.addConstraint(
    'events',
    'events_event_month_check',
    'CHECK (event_month >= 1 AND event_month <= 12)',
  );
};

export const down = false;
