const express = require('express')
const ActivitiesService = require('./activities-service')

const activitiesRouter = express.Router()
const bodyParser = express.json()

activitiesRouter
   .route('/')
   .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      ActivitiesService.getAllActivities(knexInstance)
         .then(activities => {
            res.json(activities.map(ActivitiesService.serializeActivities))
         })
         .catch(next)
   })

activitiesRouter
   .route('/:activity_id')
   .all((req, res, next) => {
      const { activity_id } = req.params
      const knexInstance = req.app.get('db')
      ActivitiesService.getById(knexInstance, activity_id)
         .then(actvity => {
            if(!actvity) {
               return res.status(404).json({ error: { message: `Activity doesn't exist` }})
            }
            res.actvity = actvity
            next()
         })
         .catch(next)
   })
   .get((req, res) => {
      res.json(ActivitiesService.serializeActivities(res.actvity))
   })


module.exports = activitiesRouter