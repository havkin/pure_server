interface IHandlerParams {
  body?: string;
  query?: URLSearchParams;
  params: string[];
}
export type RouteHandler = (data: IHandlerParams) => Promise<string> | string;

// export type Controller = Record<string, (paths?: string[]) => RouteHandler>;

export interface IController {
  GET: (paths?: string[]) => RouteHandler;
  POST: (paths?: string[]) => RouteHandler;
  PUT: (paths?: string[]) => RouteHandler;
  DELETE: (paths?: string[]) => RouteHandler;
}

export type Router = Record<string, IController>;
