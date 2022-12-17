import * as assert from 'node:assert';
import * as supertest from 'supertest';

import { server } from '../src';

// const request = supertest(server);
const request = supertest('http://localhost:3000');

describe('GET /courses', function () {
  it('', async function () {
    const response = await request
      .get('/courses')
      .set('Accept', 'application/json');
    console.log('🚀 ~ response', response.body);
  });
});
