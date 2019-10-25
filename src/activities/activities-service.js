const xss = require('xss')

const ActivitiesService = {
   getAllActivities(db) {
      return db
         .from('activities')
         .select('*')
   },

   serializeActivities(activity) {
      return {
         id: activity.id,
         summary: xss(activity.summary),
         company: xss(activity.company),
         customer_name: xss(activity.customer_name),
         description: xss(activity.description),
         date: new Date(activity.date),
         author_id: activity.author_id
      }
   },
  

}

module.exports = ActivitiesService