const app = require('../src/app')

describe('Activities Endpoints', () => {
   context('GET /api/activities', () => {
      it('responds with 200', () => {
         return supertest(app)
            .get('/api/activities')
            .expect(200)
      })
   })
})