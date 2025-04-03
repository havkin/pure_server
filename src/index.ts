import { port } from './config';
import { server } from './server';

server.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
