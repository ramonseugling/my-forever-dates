import type { NextApiResponse } from 'next';
import { commemorativeDateKeySchema, parseSchema } from '@/lib/validators';
import {
  type AuthenticatedRequest,
  authenticatedController,
} from 'infra/controller';
import commemorative from 'models/commemorative';

export default authenticatedController({
  PUT: handlePut,
  DELETE: handleDelete,
});

async function handlePut(req: AuthenticatedRequest, res: NextApiResponse) {
  const { key } = parseSchema(commemorativeDateKeySchema, {
    key: req.query.key,
  });
  await commemorative.enable(req.user.id, key);
  res.status(200).json({ key, enabled: true });
}

async function handleDelete(req: AuthenticatedRequest, res: NextApiResponse) {
  const { key } = parseSchema(commemorativeDateKeySchema, {
    key: req.query.key,
  });
  await commemorative.disable(req.user.id, key);
  res.status(204).end();
}
