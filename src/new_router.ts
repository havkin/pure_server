import { IRouteInit, IRouteMatchResult, Route } from './route';

export class Router {
  private routes: Route[];
  constructor() {
    this.routes = [];
    // this.baseURL = baseURL;
  }
  add(routeInit: IRouteInit): Router {
    const r = new Route(routeInit);
    this.routes.push(r);
    return this;
  }
  // Унифицированный матч: {url, method}
  find({
    url,
    method = 'GET',
  }: {
    url: string | URL;
    method: string | undefined;
  }): { route: Route; match: IRouteMatchResult['match']; params: IRouteMatchResult['params'] } | null {
    const u = typeof url === 'string' ? url : url.href;
    const m = method.toUpperCase();
    for (const r of this.routes) {
      if (r.method !== m) {
        continue;
      }
      const result = r.match(u);
      if (result) {
        return { route: r, ...result };
      }
    }
    return null;
  }
}
