import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn('events', {
    custom_type: {
      type: 'text',
    },
  });

  pgm.dropConstraint('events', 'events_type_check');

  pgm.addConstraint(
    'events',
    'events_type_check',
    `CHECK (type IN ('birthday', 'dating_anniversary', 'wedding_anniversary', 'celebration', 'custom'))`,
  );

  pgm.addConstraint(
    'events',
    'events_custom_type_check',
    `CHECK (
      (type = 'custom' AND custom_type IS NOT NULL AND LENGTH(TRIM(custom_type)) > 0)
      OR
      (type != 'custom' AND custom_type IS NULL)
    )`,
  );
};

export const down = false;
