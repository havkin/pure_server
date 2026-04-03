export class Route {
  // private method: string;
  private pattern: URLPattern;
  private coerce: Record<string, (s: string) => any>;
  // private handler: (params: Record<string, string>, body: any) => Promise<any>;
  constructor({
    // method = 'GET',
    pattern,
    // handler,
    coerce = {},
  }: {
    method: string;
    pattern: string;
    baseURL: string;
    options: URLPatternOptions;
    handler: (params: Record<string, string>, body: any) => Promise<any>;
    coerce: Record<string, (s: string) => any>;
  }) {
    if (!pattern) throw new TypeError('pattern is required');
    // this.method = method.toUpperCase();

    this.pattern = new URLPattern(pattern);
    // this.handler = handler;
    this.coerce = coerce; // {paramName: fn(string) => any} для приведения типов
  }

  match(input: string) {
    const isOk = this.pattern.test(input);
    if (!isOk) return null;
    const m = this.pattern.exec(input);
    // Собираем все группы из всех компонент в один объект params.
    const params = {
      ...(m?.protocol?.groups ?? {}),
      ...(m?.hostname?.groups ?? {}),
      ...(m?.port?.groups ?? {}),
      ...(m?.pathname?.groups ?? {}),
      ...(m?.search?.groups ?? {}),
      ...(m?.hash?.groups ?? {}),
    };
    // Приведение типов и доменная валидация
    for (const [k, f] of Object.entries(this.coerce)) {
      if (params[k] != null) {
        const v = f(params[k]);
        if (v === undefined) return null; // отбраковка
        params[k] = v;
      }
    }
    return { params, match: m };
  }
}
