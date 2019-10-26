const xss = require('xss')

const ActivitiesService = {
   getAllActivities(db) {
      return db
         .from('activities')
         .select('*')
   },
   getById(db, id) {
      return db
         .from('activities')
         .select('*')
         .where('id', id)
         .first()
   },
   insertActivities(db, newActivity){
      return db
         .insert(newActivity)
         .into('activities')
         .returning('*')
         .then(rows => {
            return rows[0]
         })
   },
   updateActivity(db, id, newActivityData){
      return db
         .from('activities')
         .where('id', id)
         .update(newActivityData)
   },
   deleteActivity(db, id){
      return db
         .from('activities')
         .where('id', id)
         .delete()
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