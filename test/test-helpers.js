const bcrypt = require('bcryptjs')

function makeUsersArray() {
   return [
      {
         id: 1,
         user_name: 'test-user-1',
         full_name: 'Test user 1',
         password: 'password',
         date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
         id: 2,
         user_name: 'test-user-2',
         full_name: 'Test user 2',
         password: 'password',
         date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
         id: 3,
         user_name: 'test-user-3',
         full_name: 'Test user 3',
         password: 'password',
         date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
         id: 4,
         user_name: 'test-user-4',
         full_name: 'Test user 4',
         password: 'password',
         date_created: new Date('2029-01-22T16:28:32.615Z'),
      },
   ]
}
 
function makeActivitiesArray(users) {
   return [
      {
         id: 'bf4fa1f4-2ef0-4bf1-a6cd-45b985d7d5c9',
         summary: "Activty 1",
         company: "eCorp",
         customer_name: "Mr. Robot",
         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?",
         date: new Date('2029-01-22T16:28:32.615Z').toISOString(),
         author_id: users[0].id
      },
      {
         id: 'aa6d33a9-8641-4986-b95b-6fd966331610',
         summary: "Activty 2",
         company: "Awesome Deals",
         customer_name: "Jane Doe",
         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.",
         date: new Date('2029-01-22T16:28:32.615Z').toISOString(),
         author_id: users[1].id
      },
      {
         id: 'f3c2b711-eef2-4125-a018-ecc03dc1dc72',
         summary: "Activty 3",
         company: "Energy Inc.",
         customer_name: "John Energy",
         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.",
         date: new Date('2029-01-22T16:28:32.615Z').toISOString(),
         author_id: users[2].id
      },
      {
         id: '0266c729-0449-4dd7-80db-3e899b5c5cde',
         summary: "Activty 4",
         company: "eCorp",
         customer_name: "Mr. Robot",
         description: "Bacon ipsum dolor amet doner shank beef t-bone brisket meatloaf pork loin ham hock chuck ball tip tri-tip pastrami pork chop. Buffalo venison bresaola, cow ground round brisket meatloaf tail cupim kielbasa turducken.",
         date: new Date('2029-01-22T16:28:32.615Z').toISOString(),
         author_id: users[3].id
      }
      // {
      //    id: '8e75ca8d-227f-470f-a7ea-801b706335cf',
      //    summary: "Activty 5",
      //    company: "eCorp",
      //    customer_name: "Victor",
      //    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?",
      //    date: new Date('2029-01-22T16:28:32.615Z'),
      //    author_id: users[2].id
      // },
      // {
      //    id: '8e75ca8d-227f-470f-a7ea-801b706335cf',
      //    summary: "Activty 6",
      //    company: "Awesome Deals",
      //    customer_name: "Jane Doe",
      //    description: "Beef ribs alcatra ground round prosciutto landjaeger strip steak leberkas doner spare ribs andouille filet mignon venison ham hock ham ball tip. T-bone buffalo boudin shankle short loin picanha bacon strip steak.",
      //    date: new Date('2029-01-22T16:28:32.615Z'),
      //    author_id: users[0].id
      // },
      // {
      //    id: '657f4aae-22ce-40ce-9dc2-b6595cbd7386',
      //    summary: "Activty 7",
      //    company: "Awesome Deals",
      //    customer_name: "Jane Doe",
      //    description: "Ribeye kevin pig, spare ribs drumstick jowl short ribs alcatra burgdoggen meatball buffalo biltong brisket.",
      //    date: new Date('2029-01-22T16:28:32.615Z'),
      //    author_id: users[1].id
      // }
   ]
}

function makeExpectedActivity(users, activity) {
   const author = users.find(user => user.id === activity.author_id)
   // console.log(author)
   return {
      id: activity.id,
      summary: activity.summary,
      company: activity.company,
      customer_name: activity.customer_name,
      description: activity.description,
      date: activity.date,
      author_id: activity.author_id
   }
}

function makeMaliciousActivity(user) {
   const maliciousActivity = {
     id: '657f4aae-22ce-40ce-9dc2-b6595cbd7386',
     summary: 'Naughty naughty very naughty <script>alert("xss");</script>',
     company: "Malicious Deals",
     customer_name: "Really Malicious",
     description: 'Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.',
     date: new Date(),
     author_id: user.id,
   }
   const expectedActivity = {
     ...makeExpectedActivity([user], maliciousActivity),
     summary: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
     description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
   }
   return {
      maliciousActivity,
      expectedActivity,
   }
}

function makeActivitiesFixtures() {
   const testUsers = makeUsersArray()
   const testActivities = makeActivitiesArray(testUsers)
   return { testUsers, testActivities }
}

function cleanTables(db) {
   return db.transaction(trx => 
      trx.raw(
         `TRUNCATE
          activities_users,
          activities
          `
      )
      .then(() => 
         Promise.all([
            trx.raw(`ALTER SEQUENCE activities_users_id_seq minvalue 0 START WITH 1`),
            trx.raw(`SELECT setval('activities_users_id_seq', 0)`),
         ])
      )
   )
}

function seedUsers(db, users) {
   const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
   }))
   return db.into('activities_users').insert(preppedUsers)
      .then(() => {
         db.raw(
            `SELECT setval('activities_users_id_seq', ?)`,
            [users[users.length - 1].id],
         )
      })
}

function seedActivitiesTables(db, users, activities) {
   return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('activities').insert(activities)
      // await trx.raw(
      //    `SELECT set`
      // )
   })   
}

function seedMaliciousActivity(db, user, activity) {
   // return db
   //   .into('activities_users')
   //   .insert([user])
   return seedUsers(db, [user])
     .then(() =>
       db
         .into('activities')
         .insert([activity])
     )
 }

module.exports = {
   makeUsersArray,
   makeActivitiesArray,
   makeExpectedActivity,
   makeMaliciousActivity,
   makeActivitiesFixtures,
   cleanTables,
   seedActivitiesTables,
   seedUsers,
   seedMaliciousActivity
}