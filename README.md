# Time Tracker Server

Backend server for time-tracker-app. A time and activity tracking application.

## Technologies
- Node
- Express
- JWT
- PostgreSQL

## Testing 
- Mocha
- Chai
- Supertest

## Set up

Complete the following steps to setup locally:

1. Clone this repository to your local machine `git clone git@github.com:soriaj/time-tracker-server.git <NEW-PROJECTS-NAME>`
2. `cd` into the cloned repository
3. Install the node dependencies `npm install`
4. Create an `.env` file
5. Create Postgres databases (test and prod)
6. Add TEST_DATABASE_URL and DATABASE_URL path to .env
7. Run `npm run migrate:test` and `npm run migrate` to create tables in test and prod databases

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

## Contributor(s)

Javier Soria