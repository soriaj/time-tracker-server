const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const setTZ = require('set-tz')
// setTZ('UTC')

describe('Activities Endpoints', () => {
   let db

   const {
      testUsers,
      testActivities,
   } = helpers.makeActivitiesFixtures()

   before('make knex instance', () => {
      db = knex({
         client: 'pg',
         connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
   })

   after('disconnect from db', () => db.destroy())

   before('cleanup', () => helpers.cleanTables(db))

   afterEach('clenup', () => helpers.cleanTables(db))

   describe('Protected endpoints', () => {
      beforeEach('insert activities', () =>
         helpers.seedActivitiesTables(
            db,
            testUsers,
            testActivities,
         )
      )

      describe('GET /api/activities/:activity_id', () => {
         it(`responds with 401 'Missing basic token' when no token`, () => {
            return supertest(app)
               .get(`/api/activities/0266c729-0449-4dd7-80db-3e899b5c5cde`)
               .expect(401, { error: 'Missing basic token' })
         })

         it(`responds 401 'Unauthorized request' when no credentials`, () => {
            const userNoCreds = { user_name: '', password: ''}
            return supertest(app) 
               .get(`/api/activities/0266c729-0449-4dd7-80db-3e899b5c5cde`)
               .set('Authorization', helpers.makeAuthHeader(userNoCreds))
               .expect(401, { error: 'Unauthorized request' })
         })

         it(`responds 401 'Unauthorized request' when no credentials`, () => {
            const userInvalidCreds = { user_name: 'user-not', password: 'existing'}
            return supertest(app)
               .get(`/api/activities/0266c729-0449-4dd7-80db-3e899b5c5cde`)
               .set('Authorization', helpers.makeAuthHeader(userInvalidCreds))
               .expect(401, { error: 'Unauthorized request' })
         })

         it(`responds 401 'Unauthorized request' when no credentials`, () => {
            const userInvalidPass = { user_name: testUsers[0], password: 'wrong' }
            return supertest(app)
               .get(`/api/activities/0266c729-0449-4dd7-80db-3e899b5c5cde`)
               .set('Authorization', helpers.makeAuthHeader(userInvalidPass))
               .expect(401, { error: 'Unauthorized request' })
         })

      })


   })

//END OF FILE
})