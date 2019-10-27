const express = require('express')
const path = require('path')
const ActivitiesService = require('./activities-service')
const { requireAuth } = require('../middleware/basic-auth')

const activitiesRouter = express.Router()
const bodyParser = express.json()

activitiesRouter
   .route('/')
   // .all(requireAuth)
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
   // .all(requireAuth)
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
   .delete((req, res, next) => {
      const { activity_id } = req.params
      const knexInstance = req.app.get('db')
      ActivitiesService.deleteActivity(knexInstance, activity_id)
         .then(() => {
            res.status(204).end()
         })
         .catch(next)
   })
   .patch(bodyParser, (req, res, next) => {
      const { summary, company, customer_name, description, author_id } = req.body;
      const activityToUpdate = { summary, company, customer_name, description, author_id }
      const knexInstance = req.app.get('db')
      const { activity_id } = req.params

      const numOfActivities = Object.values(activityToUpdate).filter(Boolean).length
      if(numOfActivities === 0){
         return res.status(400).json({ error: { message: `Request body must contain either 'summary', 'company', 'customer_name', 'description' `}})
      }

      ActivitiesService.updateActivity(knexInstance, activity_id, activityToUpdate)
         .then(() => {
            res.status(204).end()
         })
         .catch(next)
   })


module.exports = activitiesRouter