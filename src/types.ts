interface IHandlerParams {
  body?: string;
  query?: URLSearchParams;
  params: string[];
}
export type RouteHandler = (data: IHandlerParams) => Promise<string> | string;

// export type Controller = Record<string, (paths?: string[]) => RouteHandler>;

export interface IController {
  GET: (paths: string[]) => RouteHandler | null;
  POST: (paths: string[]) => RouteHandler | null;
  PUT: (paths: string[]) => RouteHandler | null;
  DELETE: (paths: string[]) => RouteHandler | null;
}

export type Router = Record<string, IController>;
