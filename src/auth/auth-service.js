const bcrypt = require('bcryptjs')

const AuthService = {
   getUserWithUserName(db, user_name) {
      return db
         .from('activities_users')
         .where('user_name', user_name)
         .first()
   },
   comparepasswords(password, hash) {
      return bcrypt.compare(password, hash)
   },
   parseBasicToken(token) {
     return Buffer.from(token, 'base64').toString().split(':')
   },
}
 
module.exports = AuthService