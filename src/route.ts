export interface IRouteInit {
  method: string;
  pattern: string | Record<string, string>;
  baseURL?: string;
  // options?: URLPatternOptions;
  handler: (dto: {
    params: Record<string, string | undefined>;
    body: unknown;
    url: URL;
  }) => Promise<Response> | Response;
  coerce?: Record<string, (s: string) => any>;
}

export interface IRouteMatchResult {
  params: Record<string, string | undefined>;
  match: URLPatternResult | null;
}

export class Route {
  method: string;
  private pattern: URLPattern;
  private coerce: Record<string, (s: string) => any>;
  handler: IRouteInit['handler'];
  constructor({ method = 'GET', pattern, handler, coerce = {} }: IRouteInit) {
    if (!pattern) {
      throw new TypeError('pattern is required');
    }
    this.method = method.toUpperCase();

    this.pattern = new URLPattern(pattern);
    this.handler = handler;
    this.coerce = coerce; // {paramName: fn(string) => unknown} для приведения типов
  }

  match(url: string): IRouteMatchResult | null {
    const isOk = this.pattern.test(url);
    if (!isOk) {
      return null;
    }
    const result = this.pattern.exec(url);
    // Собираем все группы из всех компонент в один объект params.
    const params = {
      ...(result?.protocol?.groups ?? {}),
      ...(result?.hostname?.groups ?? {}),
      ...(result?.port?.groups ?? {}),
      ...(result?.pathname?.groups ?? {}),
      ...(result?.search?.groups ?? {}),
      ...(result?.hash?.groups ?? {}),
    };
    // Приведение типов и доменная валидация
    for (const [k, f] of Object.entries(this.coerce)) {
      if (params[k] != null) {
        const v = f(params[k]);
        if (v === undefined) {
          return null; // отбраковка
        }
        params[k] = v;
      }
    }
    return { params, match: result };
  }
}
