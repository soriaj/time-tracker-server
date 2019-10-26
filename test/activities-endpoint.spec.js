const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

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

   describe.only('GET /api/activities', () => {
      context('Given no activities', () => {
         it('responds with 200 and empty list', () => {
            return supertest(app)
               .get('/api/activities')
               .expect(200, [])
         })
      })

      context('Given there are activities in the database', () => {
         beforeEach('insert activities', () =>
            helpers.seedActivitiesTables(
               db,
               testUsers,
               testActivities,
           )
         )
   
         it('responds with 200 and all of the activities', () => {
            const expectedActivities = testActivities.map(activity =>
               helpers.makeExpectedActivity(
                  testUsers,
                  activity,
               )
            )
            return supertest(app)
               .get('/api/activities')
               .expect(200, expectedActivities)
         })
      })

      context(`Given an XSS attack article`, () => {
         const testUser = helpers.makeUsersArray()[1]
         const {
           maliciousActivity,
           expectedActivity,
         } = helpers.makeMaliciousActivity(testUser)
   
         beforeEach('insert malicious article', () => {
           return helpers.seedMaliciousActivity(
             db,
             testUser,
             maliciousActivity,
           )
         })
   
         it('removes XSS attack content', () => {
           return supertest(app)
             .get(`/api/activities`)
             .expect(200)
             .expect(res => {
               expect(res.body[0].summary).to.eql(expectedActivity.summary)
               expect(res.body[0].description).to.eql(expectedActivity.description)
             })
         })
      })
   })

// END OF TESTS
})