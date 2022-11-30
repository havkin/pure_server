import { randomUUID } from 'node:crypto';

import { db } from './db';
import type { RouteHandler } from './types';

// export async function routes(fastify: FastifyInstance, options) {

//   fastify.get<{ Params: { id: string } }>(
//     '/courses/:id',
//     async (request, reply) => {
//       const res = db.find((item) => item.id === Number(request.params.id));
//       if (!res) {
//         throw new Error('No documents found');
//       }
//       return res;
//     },
//   );

//   fastify.delete<{ Params: { id: string } }>(
//     '/courses/:id',
//     async (request, reply) => {
//       const index = db.findIndex(
//         (item) => item.id === Number(request.params.id),
//       );
//       if (index < 0) {
//         throw new Error('No documents found');
//       }
//       db.splice(index, 1);
//       return { index };
//     },
//   );

//   fastify.put<{ Params: { id: string }; Body: { title: string } }>(
//     '/courses/:id',
//     async (request, reply) => {
//       const index = db.findIndex(
//         (item) => item.id === Number(request.params.id),
//       );
//       if (index < 0) {
//         throw new Error('No documents found');
//       }
//       db[index].title = request.body.title;
//       return db[index];
//     },
//   );
const get: RouteHandler = async (data) => {
  let res = [...db];
  const title = data.query.get('title');
  if (title) {
    res = res.filter((item) => item.title.includes(title));
  }
  return JSON.stringify(res);
};

const post: RouteHandler = async (data) => {
  const body = JSON.parse(data.body);
  const newItem = {
    id: randomUUID(),
    title: body.title,
  };
  db.push(newItem);
  return JSON.stringify(newItem);
};

const coursesController = {
  GET: get,
  POST: post,
  DELETE: '',
  PUT: '',
};

export const router = {
  '/courses': coursesController,
};
