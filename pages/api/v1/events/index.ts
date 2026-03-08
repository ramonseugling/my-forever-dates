import type { NextApiResponse } from 'next';
import {
  AuthenticatedRequest,
  authenticatedController,
} from 'infra/controller';
import event from 'models/event';

export default authenticatedController({
  GET: handleGet,
  POST: handlePost,
});

async function handleGet(req: AuthenticatedRequest, res: NextApiResponse) {
  const events = await event.findAllByUserId(req.user.id);
  res.status(200).json({ events });
}

async function handlePost(req: AuthenticatedRequest, res: NextApiResponse) {
  const { title, type, event_day, event_month } = req.body;

  const createdEvent = await event.create(req.user.id, {
    title,
    type,
    event_day,
    event_month,
  });

  res.status(201).json(createdEvent);
}
