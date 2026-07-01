import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn('users', {
    marketing_consent: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
  });
};

export const down = false;
