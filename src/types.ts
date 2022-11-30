interface IHandlerParams {
  body?: string;
  query?: URLSearchParams;
}
export type RouteHandler = (data: IHandlerParams) => Promise<string>;
