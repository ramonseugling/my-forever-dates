import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  pgm.alterColumn('users', 'password', {
    notNull: false,
  });
};

export const down = false;
