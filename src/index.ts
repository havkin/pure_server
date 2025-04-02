import { port } from './config/index.ts';
import { server } from './server.ts';

server.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
