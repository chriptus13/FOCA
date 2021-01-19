'use strict'

const util = require('./util')

const Handlebars = require('handlebars/dist/handlebars')
const leaguesView = require('../views/leagues.html')
const listLeaguesTemplate = require('../views/listLeagues.hbs')
const listLeaguesView = Handlebars.compile(listLeaguesTemplate)
const teamsTemplate = require('../views/teams.hbs')
const teamsView = Handlebars.compile(teamsTemplate)


module.exports = (divMain) => {
    divMain.innerHTML = leaguesView
    const divLeagues = document.getElementById('divListLeagues')
    util.fetchJSON('http://localhost:3000/api/leagues')
        .then(leagues => {
            divLeagues.innerHTML = listLeaguesView(leagues)
            leagues.forEach(l => {
                document
                    .getElementById("btnleague_" + l.id)
                    .addEventListener('click', btnClick.bind(null, l.id))
            })
        })
        .catch(err => util.showAlert(err))


    function btnClick(lId, ev) {
        ev.preventDefault()
        const td = document.getElementById('leagueTeams_' + lId)
        util.fetchJSON('http://localhost:3000/api/leagues/' + lId + '/teams')
            .then(teams => td.innerHTML = teamsView(teams))
            .catch(() => td.innerHTML = 'No teams found for this league!')
    }
}

