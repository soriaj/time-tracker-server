const express = require('express')
const path = require('path')
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
   .post(bodyParser, (req, res, next) => {
      const { summary, company, customer_name, description, author_id } = req.body;
      const newActivity = { summary, company, customer_name, description, author_id }
      const knexInstance = req.app.get('db')

      for(const [key, value] of Object.entries(newActivity))
         if(value == null) {
            return res.status(400).json({ error: `Missing '${key}' in request body` })
         }

      ActivitiesService.insertActivity(knexInstance, newActivity)
         .then(activity => {
            res.status(201)
            .location(path.posix.join(req.originalUrl, `/${activity.id}`))
            .json(ActivitiesService.serializeActivities(activity))
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