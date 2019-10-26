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

   // GET ACTIVITY TEST
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

   // GET SPECIFIC ACTIVITY TEST
   describe('GET /api/activities/:activity_id', () => {
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

   // POST ACTIVITY TEST
   describe('POST /api/activities', () => {
      beforeEach('insert activities', () =>
         helpers.seedActivitiesTables(
            db,
            testUsers,
            testActivities,
         )
      )

      it('create a acitivty, responding with 201 and the new acitivty', function() {
         this.retries(3)

         const newActivity = {
            summary: "New Activity",
            company: "New Company",
            customer_name: "New Customer",
            description: "New Description for POST",
            date: new Date('2029-01-22T16:28:32.615Z'),
            author_id: testUsers[0].id
         }
         return supertest(app)
            .post('/api/activities')
            // .set('Autorization', `Bearer ${process.env.API_TOKEN}`)
            .send(newActivity)
            .expect(201)
            .expect(res => {
               expect(res.body).to.have.property('id')
               expect(res.body.summary).to.eql(newActivity.summary)
               expect(res.body.company).to.eql(newActivity.company)
               expect(res.body.customer_name).to.eql(newActivity.customer_name)
               expect(res.body.description).to.eql(newActivity.description)
               expect(res.headers.location).to.eql(`/api/activities/${res.body.id}`)
               const expected = new Date().toLocaleString()
               const actual = new Date(res.body.date).toLocaleString()
               expect(expected).to.eql(actual)
            })
            .then(postRes => {
               supertest(app)
                  .get(`/api/activities/${postRes.body.id}`)
                  .expect(postRes.body)
            })
      })

      const requiredFields = ['summary', 'company', 'customer_name']

      requiredFields.forEach(field => {
         const testActivity = testActivities[0]
         const testUser = testUsers[0]
         const newActivity = {
            summary: "New Activity",
            company: "New Company",
            customer_name: "New Customer",
            description: "New Description for POST",
            date: new Date('2029-01-22T16:28:32.615Z'),
            author_id: testUsers[0].id
         }

         it(`responds with 400 and error message when the '${field}' is missin`, () => {
            delete newActivity[field]

            return supertest(app)
               .post('/api/activities')
               // .set('Authorization', helpers.makeAuthHeader(testUser))
               .send(newActivity)
               .expect(400, { error: `Missing '${field}' in request body` })
         })
      })
   })

   // DELETE ACTIVITY TEST
   describe('DELETE /api/acitvities/:activity_id', () => {
      context('Given no acitivty', () => {
         it('responds with 404', () => {
            const acitivtyId = '0d8ff411-5938-4777-9142-759d99cdd934'
            return supertest(app)
               .delete(`/api/activities/${acitivtyId}`)
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

         it('responds with 204 and the removes the activity', () => {
            const idToRemove = 'bf4fa1f4-2ef0-4bf1-a6cd-45b985d7d5c9'
            const expectedActivity = testActivities.filter(activity => activity.id !== idToRemove)
            return supertest(app)
               .delete(`/api/activities/${idToRemove}`)
               // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
               .expect(204)
               .then(res => {
                  supertest(app)
                     .get('/api/activities')
                     // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                     .expect(expectedActivity)
               })
         })
      })
   })

   // PATCH ACTIVITY TEST
   describe('PATCH /api/activities/:activity_id', () => {
      context('Given no acitivty', () => {
         it('responds with 404', () => {
            const acitivtyId = '0d8ff411-5938-4777-9142-759d99cdd934'
            return supertest(app)
               .delete(`/api/activities/${acitivtyId}`)
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

         it('responds with 204 and the updates the activity', () => {
            const idToUpdate = 'bf4fa1f4-2ef0-4bf1-a6cd-45b985d7d5c9'
            const updateActivity = {
               summary: "Updated Activity",
               company: "Updated Company",
               customer_name: "Updated Customer",
               description: "Updated Description for PATCH",
               date: new Date('2029-01-22T16:28:32.615Z'),
               author_id: testUsers[0].id
            }

            const findActivityToUpdate = testActivities.filter(activity => activity.id == idToUpdate)
            const expectedActivity = {
               ...findActivityToUpdate,
               ...updateActivity
            }
            return supertest(app)
               .patch(`/api/activities/${idToUpdate}`)
               // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
               .send(updateActivity)
               .expect(204)
               .then(res => {
                  supertest(app)
                     .get(`/api/activities/${idToUpdate}`)
                     .expect(expectedActivity)
               })
         })

         it('responds with 400 when no required fields are supplied', () => {
            const idToUpdate = 'bf4fa1f4-2ef0-4bf1-a6cd-45b985d7d5c9'
            return supertest(app)
               .patch(`/api/activities/${idToUpdate}`)
               // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
               .send({ bogusField: 'Bad field data to send' })
               .expect(400, { error: { message: `Request body must contain either 'summary', 'company', 'customer_name', 'description' `} })
         })

         it('responds with 204 when updating only a part of the fields', () => {
            const idToUpdate = 'bf4fa1f4-2ef0-4bf1-a6cd-45b985d7d5c9'
            const updateActivity = { summary: 'Updated Summary Only' }
            const findActivityToUpdate = testActivities.filter(activity => activity.id == idToUpdate)
            const expectedActivity = {
               ...findActivityToUpdate,
               ...updateActivity
            }

            return supertest(app)
            .patch(`/api/activities/${idToUpdate}`)
               // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
               .send({
                  ...updateActivity,
                  bogusField: 'Bad field data to send, not in GET response'
               })
               .expect(204)
               .then(res => {
                  supertest(app)
                     .get(`/api/activities/${idToUpdate}`)
                     .expect(expectedActivity)
               })

         })
      })
   })

// END OF TESTS
})