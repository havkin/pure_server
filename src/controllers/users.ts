import { Router } from '../new_router';

export function buildRouter() {
  const router = new Router();

  // GET /health
  router.add({
    method: 'GET',
    pattern: { pathname: '/health' },
    handler: () => new Response('ok', { status: 200 }),
  });

  // GET /users/:id, где id — положительное число
  router.add({
    method: 'GET',
    pattern: { pathname: '/users/:id([1-9][0-9]*)' },
    coerce: {
      id: (s) => {
        const n = Number(s);
        return Number.isSafeInteger(n) ? n : undefined;
      },
    },
    handler: ({ params }) => {
      // тут достаём пользователя из БД; пока возвращаем echo
      return toJsonResponse({ id: params.id });
    },
  });

  // GET /search?q=строка&limit=число
  router.add({
    method: 'GET',
    // search тоже матчится: порядок и разделители учитываются
    pattern: { pathname: '/search', search: '?q=:q&limit=:limit([0-9]{1,2})' },
    coerce: {
      limit: (s) => {
        const n = Number(s);
        return n >= 1 && n <= 50 ? n : 10;
      },
    },
    handler: ({ url, params }) => {
      // url — экземпляр URL, с нормальными searchParams
      const q = params.q ?? url.searchParams.get('q') ?? '';
      const limit = params.limit ?? 10;
      return toJsonResponse({ q, limit });
    },
  });

  return router;
}

function toJsonResponse(obj: Record<string, unknown>, init = {}): Response {
  return new Response(JSON.stringify(obj), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
    ...init,
  });
}
