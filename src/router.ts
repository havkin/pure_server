/* eslint-disable @typescript-eslint/require-await */
import { randomUUID } from 'node:crypto';

import { db } from './db';
import type { RouteHandler } from './types';

const get: RouteHandler = async (data) => {
  let res = [...db];
  const title = data.query.get('title');
  if (title) {
    res = res.filter((item) => item.title.includes(title));
  }
  return JSON.stringify(res);
};

const getById: RouteHandler = async (data) => {
  let res = [...db];
  const id = data.params[0];
  if (id) {
    res = res.filter((item) => item.id === id);
  }
  return JSON.stringify(res);
};

const deleteItem: RouteHandler = async (data) => {
  const id = data.params[0];
  const index = db.findIndex((item) => item.id === id);
  if (index < 0) {
    throw new Error('No documents found');
  }
  db.splice(index, 1);

  return JSON.stringify(db);
};

const put: RouteHandler = async (data) => {
  const id = data.params[0];
  const index = db.findIndex((item) => item.id === id);
  if (index < 0) {
    throw new Error('No documents found');
  }
  const body = JSON.parse(data.body);

  db[index].title = body.title;

  return JSON.stringify(db[index]);
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

const getHandler = (paths: string[]): RouteHandler => {
  const handlers = [get, getById];
  return handlers[paths.length];
};

const coursesController = {
  GET: getHandler,
  POST: () => post,
  DELETE: () => deleteItem,
  PUT: () => put,
};

export const router = {
  courses: coursesController,
};
