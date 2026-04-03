import { coursesController } from './controllers/courses';
import { defaultController } from './controllers/default';
import type { IController, RouteHandler, Router } from './types';

export const router: Router = {
  courses: coursesController,
};

export const getRouteHandler = (url: URL, method: keyof IController): RouteHandler | null => {
  const [controller, ...paths] = url.pathname.split('/').filter((path) => path !== '');
  if (controller in router) {
    return router[controller][method](paths);
  }
  return defaultController[method]([controller, ...paths]);
};
