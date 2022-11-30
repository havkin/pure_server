import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';

import { db } from './db';

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
export async function routes(fastify: FastifyInstance, options) {
  fastify.get('/', async (request, reply) => ({ hello: 'world' }));

  fastify.get<{ Params: { id: string } }>(
    '/courses/:id',
    async (request, reply) => {
      const res = db.find((item) => item.id === Number(request.params.id));
      if (!res) {
        throw new Error('No documents found');
      }
      return res;
    },
  );

  fastify.get<{ Querystring: { title: string } }>(
    '/courses',
    async (request, reply) => {
      let res = [...db];
      if ('title' in request.query) {
        res = res.filter((item) => item.title.includes(request.query.title));
      }
      return res;
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    '/courses/:id',
    async (request, reply) => {
      const index = db.findIndex(
        (item) => item.id === Number(request.params.id),
      );
      if (index < 0) {
        throw new Error('No documents found');
      }
      db.splice(index, 1);
      return { index };
    },
  );

  fastify.put<{ Params: { id: string }; Body: { title: string } }>(
    '/courses/:id',
    async (request, reply) => {
      const index = db.findIndex(
        (item) => item.id === Number(request.params.id),
      );
      if (index < 0) {
        throw new Error('No documents found');
      }
      db[index].title = request.body.title;
      return db[index];
    },
  );

  fastify.post<{ Body: { title: string } }>(
    '/courses',
    async (request, reply) => {
      const newItem = {
        id: randomUUID(),
        title: request.body.title,
      };
      db.push(newItem);
      return newItem;
    },
  );
}
