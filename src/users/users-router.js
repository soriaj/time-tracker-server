const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const bodyParser = express.json()

usersRouter
  .post('/', bodyParser, (req, res, next) => {
      const { full_name, user_name, password } = req.body
      const newUser = { full_name, user_name, password }

      for(const [key, value] of Object.entries(newUser))
         if(value === null) {
            return res.status(400).json({ error: `Missing '${key}' in request body` })
         }

         const passwordError = UsersService.validatePassword(password)

         if(passwordError){
            return res.status(400).json({ error: passwordError })
         }

         UsersService.duplicateUsername(
            req.app.get('db'),
            newUser.user_name,
         )
         .then(duplicateUsername => {
            if(duplicateUsername){
               return res.status(400).json({ error: `Username already taken` })
            }

            return UsersService.hashPassword(password)
               .then(hashedPassword => {
                  const newUser = {
                     full_name,
                     user_name,
                     password: hashedPassword
                  }
         
                  return UsersService.insertUser(
                     req.app.get('db'),
                     newUser
                  )
                  .then(user => {
                     res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                        .json(UsersService.serializeUser(user))
                  })
               })         
         })
         .catch(next)

})

module.exports = usersRouter