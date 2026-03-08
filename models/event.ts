import database from 'infra/database';
import { NotFoundError, ValidationError } from 'infra/errors';

const VALID_TYPES = [
  'birthday',
  'dating_anniversary',
  'wedding_anniversary',
  'celebration',
] as const;

type EventType = (typeof VALID_TYPES)[number];

interface CreateEventInput {
  title: string;
  type: string;
  event_day: number;
  event_month: number;
}

interface UpdateEventInput {
  title?: string;
  type?: string;
  event_day?: number;
  event_month?: number;
}

function validateType(type: string): asserts type is EventType {
  if (!VALID_TYPES.includes(type as EventType)) {
    throw new ValidationError({
      message: `Tipo de evento inválido: "${type}".`,
      action: `Use um dos tipos válidos: ${VALID_TYPES.join(', ')}.`,
    });
  }
}

function validateDay(day: number) {
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    throw new ValidationError({
      message: 'Dia do evento inválido.',
      action: 'O dia deve ser um número inteiro entre 1 e 31.',
    });
  }
}

function validateMonth(month: number) {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new ValidationError({
      message: 'Mês do evento inválido.',
      action: 'O mês deve ser um número inteiro entre 1 e 12.',
    });
  }
}

async function create(userId: string, input: CreateEventInput) {
  if (!input.title || input.title.trim() === '') {
    throw new ValidationError({
      message: 'O título do evento é obrigatório.',
      action: 'Informe um título para o evento.',
    });
  }

  if (!input.type) {
    throw new ValidationError({
      message: 'O tipo do evento é obrigatório.',
      action: `Use um dos tipos válidos: ${VALID_TYPES.join(', ')}.`,
    });
  }

  validateType(input.type);
  validateDay(input.event_day);
  validateMonth(input.event_month);

  const result = await database.query(
    `INSERT INTO events (title, type, event_day, event_month, user_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      input.title.trim(),
      input.type,
      input.event_day,
      input.event_month,
      userId,
    ],
  );

  return result.rows[0];
}

async function findAllByUserId(userId: string) {
  const result = await database.query(
    `SELECT * FROM events WHERE user_id = $1`,
    [userId],
  );

  return result.rows;
}

async function findOneById(id: string, userId: string) {
  const result = await database.query(
    `SELECT * FROM events WHERE id = $1 AND user_id = $2 LIMIT 1`,
    [id, userId],
  );

  if (!result.rows[0]) {
    throw new NotFoundError({
      message: 'Evento não encontrado.',
      action: 'Verifique o ID do evento e tente novamente.',
    });
  }

  return result.rows[0];
}

async function update(id: string, userId: string, input: UpdateEventInput) {
  await findOneById(id, userId);

  if (input.type !== undefined) {
    validateType(input.type);
  }

  if (input.event_day !== undefined) {
    validateDay(input.event_day);
  }

  if (input.event_month !== undefined) {
    validateMonth(input.event_month);
  }

  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (input.title !== undefined) {
    if (input.title.trim() === '') {
      throw new ValidationError({
        message: 'O título do evento não pode ser vazio.',
        action: 'Informe um título válido para o evento.',
      });
    }
    fields.push(`title = $${paramIndex++}`);
    values.push(input.title.trim());
  }

  if (input.type !== undefined) {
    fields.push(`type = $${paramIndex++}`);
    values.push(input.type);
  }

  if (input.event_day !== undefined) {
    fields.push(`event_day = $${paramIndex++}`);
    values.push(input.event_day);
  }

  if (input.event_month !== undefined) {
    fields.push(`event_month = $${paramIndex++}`);
    values.push(input.event_month);
  }

  if (fields.length === 0) {
    throw new ValidationError({
      message: 'Nenhum campo para atualizar foi informado.',
      action: 'Informe ao menos um campo para atualizar.',
    });
  }

  fields.push(`updated_at = now()`);
  values.push(id, userId);

  const result = await database.query(
    `UPDATE events SET ${fields.join(', ')}
     WHERE id = $${paramIndex++} AND user_id = $${paramIndex}
     RETURNING *`,
    values,
  );

  return result.rows[0];
}

async function deleteById(id: string, userId: string) {
  await findOneById(id, userId);

  await database.query(`DELETE FROM events WHERE id = $1 AND user_id = $2`, [
    id,
    userId,
  ]);
}

const event = { create, findAllByUserId, findOneById, update, deleteById };

export default event;
