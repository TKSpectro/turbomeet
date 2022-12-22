// next api route
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderTrpcPanel } from 'trpc-panel';
import { appRouter } from '../../server/trpc/router/_app';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.send(renderTrpcPanel(appRouter, { url: 'http://localhost:3000/api/panel' }));
}
