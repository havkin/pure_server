import { IController, RouteHandler } from 'src/types';

const getVersion: RouteHandler = () => {
  const version = process.env.npm_package_version;
  return JSON.stringify({ apiVersion: version });
};

const getHandler = (paths: string[]): RouteHandler | undefined => {
  const handlers = { version: getVersion };
  if (paths[0] in handlers) {
    return handlers[paths[0]];
  }
  return undefined;
};

export const defaultController: IController = {
  GET: getHandler,
  POST: () => undefined,
  DELETE: () => undefined,
  PUT: () => undefined,
};
