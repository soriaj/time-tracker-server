const express = require('express')

const activitiesRouter = express.Router()

activitiesRouter
   .route('/')
   .get((req, res, next) => {
      res.send('You made it to the activities router')
   })

module.exports = activitiesRouter