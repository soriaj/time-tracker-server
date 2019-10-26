const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const setTZ = require('set-tz')
setTZ('UTC')

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

   describe('GET /api/activities', () => {
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

   describe.only('GET /api/activities/:activity_id', () => {
      context('Given no acitivty', () => {
         it('responds with 404', () => {
            const acitivtyId = '0d8ff411-5938-4777-9142-759d99cdd934'
            return supertest(app)
               .get(`/api/activities/${acitivtyId}`)
               // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
               .expect(404, { error: { message: `Activity doesn't exist` }})
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

         it('responds with 200 and the specified activity', () => {
            const acitivtyId = 'bf4fa1f4-2ef0-4bf1-a6cd-45b985d7d5c9'
            const expectedActivity = testActivities[0]
            return supertest(app)
               .get(`/api/activities/${acitivtyId}`)
               // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
               .expect(200, expectedActivity)
         })
      })
   })

// END OF TESTS
})