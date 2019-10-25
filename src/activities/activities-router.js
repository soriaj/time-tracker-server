const express = require('express')
const ActivitiesService = require('./activities-service')

const activitiesRouter = express.Router()

activitiesRouter
   .route('/')
   .get((req, res, next) => {
      const knexInstance = req.app.get('db')
      ActivitiesService.getAllActivities(knexInstance)
         .then(activities => {
            res.json(activities.map(ActivitiesService.serializeActivities))
            // console.log(activities)
            // res.json()
         })
         .catch(next)
   })

module.exports = activitiesRouter