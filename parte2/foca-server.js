'use strict'

/*
// foca-services-mock
const foca = require('./services/foca-services-mock').init()
*/

/*
// foca-db-mock and football-data-mock
const focaDB = require('./data/foca-db-mock').init()
const footballDB = require('./data/football-data-mock').init()
const foca = require('./services/foca-services').init(focaDB, footballDB)
*/


// real foca-db and football-data
const es = {
    host: 'localhost',
    port: 9200,
    groups_index: 'groups/group'
}
const focaDB = require('./data/foca-db').init(es)

// Get a key at https://www.football-data.org/
const authKey = '<API_KEY>'
const footballDB = require('./data/football-data').init(authKey)

const foca = require('./services/foca-services').init(focaDB, footballDB)

const express = require('express')
const app = express()
app.use(express.json())
require('./web-api/foca-web-api')(app, foca)

const port = 3000
app
    .listen(port, () => {
        console.log(`Server listening on port ${port}...`)
    })