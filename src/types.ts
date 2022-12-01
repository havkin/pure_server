interface IHandlerParams {
  body?: string;
  query?: URLSearchParams;
  params: string[];
}
export type RouteHandler = (data: IHandlerParams) => Promise<string>;
