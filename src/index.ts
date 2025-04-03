import { port } from './config/index';
import { server } from './server';

server.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
