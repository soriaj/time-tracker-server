const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const setTZ = require('set-tz')
// setTZ('UTC')

describe.only('Activities Endpoints', () => {
   let db
   
   const { testUsers } = helpers.makeActivitiesFixtures()
   const testUser = testUsers[0]

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

   describe('Post /api/auth/login', () => {
      beforeEach('insert users', () => 
         helpers.seedUsers(db, testUsers)
      )

      const requiredFields = ['user_name', 'password']

   requiredFields.forEach(field => {
      const loginAttemptBody = {
         user_name: testUser.user_name,
         password: testUser.password,
      }

      it(`responds with 400 required error when '${field}' is missing`, () => {
      delete loginAttemptBody[field]

      return supertest(app)
         .post('/api/auth/login')
         .send(loginAttemptBody)
         .expect(400, {
            error: `Missing '${field}' in request body`,
         })
      })
 })

   })


//END OF FILE
})