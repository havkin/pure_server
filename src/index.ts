import Fastify from 'fastify';

import { routes } from './router';

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  await fastify.register(routes);
  try {
    const address = await fastify.listen({ port: 3000 });
    // fastify.log.info(`server listening on ${address}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

void start();
