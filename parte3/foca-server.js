'use strict'

// Development mode
/*
const morgan = require('morgan')

const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')
*/

const express = require('express')
const expressSession = require('express-session')
const passport = require('passport')

const focaWebApi = require('./lib/web-api/foca-web-api')
const authWebApi = require('./lib/web-api/auth-web-api')

/*
// foca-services-mock
const foca = require('./lib/services/foca-services-mock').init()
*/

/*
// foca-db-mock and football-data-mock
const focaDB = require('./lib/data/foca-db-mock').init()
const footballDB = require('./lib/data/football-data-mock').init()
const foca = require('./lib/services/foca-services').init(focaDB, footballDB)
*/

// real foca-db and football-data
const es = {
    host: 'localhost',
    port: 9200,
    groups_index: 'groups/group',
    auth_index: 'users/user'
}
const focaDB = require('./lib/data/foca-db').init(es)
const footballDB = require('./lib/data/football-data').init(process.env.npm_package_config_footballDataAPIKey)
const foca = require('./lib/services/foca-services').init(focaDB, footballDB)

// Auth 
const authDB = require('./lib/data/auth-db').init(es)
const auth = require('./lib/services/auth-services').init(authDB)

const port = process.env.npm_package_config_serverPort
const app = express()

//app.use(morgan('dev'))    // devlopment mode
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const secret = process.env.npm_package_config_expressSecret
app.use(expressSession({ secret, resave: false, saveUninitialized: true }))


passport.serializeUser((userId, done) => done(null, userId._id))
passport.deserializeUser((userId, done) => {
    auth.getUser(userId)
        .then(user => done(null, user))
        .catch(err => done(err))
})
app.use(passport.initialize())
app.use(passport.session())

//app.use(webpackMiddleware(webpack(webpackConfig)))    // webpack development mode
app.get('/favicon.ico', express.static('app/img/favicon.ico'))
app.use(express.static('dist')) // webpack production mode

authWebApi(app, auth)
focaWebApi(app, foca)

app
    .listen(port, () => console.log(`Server listening on port ${port}...`) )
