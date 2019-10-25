const xss = require('xss')

const ActivitiesService = {
   getAllActivities(db) {
      return db
         .from('activities')
         .select('*')
   },

   serializeActivities(actvity) {
      return {
         id: actvity.id,
         summary: xss(activity.summary),
         company: xss(activity.company),
         customer_name: xss(activity.customer_name),
         description: xss(activity.description),
         date: new Date(activity.date),
         author_id: activity.author_id
      //   author: {
      //     id: author.id,
      //     user_name: author.user_name,
      //     full_name: author.full_name,
      //     nickname: author.nickname,
      //     date_created: new Date(author.date_created),
      //     date_modified: new Date(author.date_modified) || null
      //   },
      }
   },
  

}

module.exports = ActivitiesService