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
         id: 1,
         summary: "Activty 1",
         company: "eCorp",
         customer_name: "Mr. Robot",
         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?",
         date: new Date('2029-01-22T16:28:32.615Z'),
         author_id: 1
      },
      {
         id: 2,
         summary: "Activty 2",
         company: "Awesome Deals",
         customer_name: "Jane Doe",
         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.",
         date: new Date('2029-01-22T16:28:32.615Z'),
         author_id: 2
      },
      {
         id: 3,
         summary: "Activty 3",
         company: "Energy Inc.",
         customer_name: "John Energy",
         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.",
         date: new Date('2029-01-22T16:28:32.615Z'),
         author_id: 3
      },
      {
         id: 4,
         summary: "Activty 4",
         company: "eCorp",
         customer_name: "Mr. Robot",
         description: "Bacon ipsum dolor amet doner shank beef t-bone brisket meatloaf pork loin ham hock chuck ball tip tri-tip pastrami pork chop. Buffalo venison bresaola, cow ground round brisket meatloaf tail cupim kielbasa turducken.",
         date: new Date('2029-01-22T16:28:32.615Z'),
         author_id: 1
      },
      {
         id: 5,
         summary: "Activty 5",
         company: "eCorp",
         customer_name: "Victor",
         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?",
         date: new Date('2029-01-22T16:28:32.615Z'),
         author_id: 2
      },
      {
         id: 6,
         summary: "Activty 6",
         company: "Awesome Deals",
         customer_name: "Jane Doe",
         description: "Beef ribs alcatra ground round prosciutto landjaeger strip steak leberkas doner spare ribs andouille filet mignon venison ham hock ham ball tip. T-bone buffalo boudin shankle short loin picanha bacon strip steak.",
         date: new Date('2029-01-22T16:28:32.615Z'),
         author_id: 1
      },
      {
         id: 7,
         summary: "Activty 7",
         company: "Awesome Deals",
         customer_name: "Jane Doe",
         description: "Ribeye kevin pig, spare ribs drumstick jowl short ribs alcatra burgdoggen meatball buffalo biltong brisket.",
         date: new Date('2029-01-22T16:28:32.615Z'),
         author_id: 1
      }
   ]
}

function makeExpectedActvitiy(users, actvity) {
   const author = users.find(user => user.id === actvity.author_id)
 
   return {
      id: actvity.id,
      summary: activity.summary,
      company: activity.company,
      customer_name: activity.customer_name,
      description: activity.description,
      date: activity.date.toISOString(),
      author_id: activity.author_id
      // number_of_comments,
      // author: {
      //    id: author.id,
      //    user_name: author.user_name,
      //    full_name: author.full_name,
      //    nickname: author.nickname,
      //    date_created: author.date_created.toISOString(),
      //    date_modified: author.date_modified || null,
      // },
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

function seedActivitiesTable(db, users, activities) {
   return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('activities').insert(activities)
      // await trx.raw(
      //    `SELECT set`
      // )
   })   
}

module.exports = {
   makeUsersArray,
   makeActivitiesArray,
   makeExpectedActvitiy,
   makeActivitiesFixtures,
   cleanTables,
   seedActivitiesTable,
   seedUsers
}