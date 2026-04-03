import { IController, RouteHandler } from '../types';

const getVersion: RouteHandler = () => {
  const version = process.env.npm_package_version;
  return JSON.stringify({ apiVersion: version });
};

const getHandler = (paths: string[]): RouteHandler | null => {
  const handlers: Record<string, RouteHandler> = { version: getVersion };
  if (paths[0] in handlers) {
    return handlers[paths[0]];
  }
  return null;
};

export const defaultController: IController = {
  GET: getHandler,
  POST: () => null,
  DELETE: () => null,
  PUT: () => null,
};
