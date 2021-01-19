'use strict'

const util = require('./util')

const Handlebars = require('handlebars/dist/handlebars')
const focaIndextemplate = require('../views/focaIndex.hbs')
const focaIndexView = Handlebars.compile(focaIndextemplate)
const groupsTemplate = require('../views/groups.hbs')
const groupsView = Handlebars.compile(groupsTemplate)
const groupTemplate = require('../views/group.hbs')
const groupView = Handlebars.compile(groupTemplate)
const addGroupView = require('../views/addGroupForm.html')
const editGroupTemplate = require('../views/editGroupForm.hbs')
const editGroupView = Handlebars.compile(editGroupTemplate)
const listLeaguesTemplate = require('../views/listLeagues.hbs')
const listLeaguesView = Handlebars.compile(listLeaguesTemplate)
const teamsTemplate = require('../views/addTeams.hbs')
const teamsView = Handlebars.compile(teamsTemplate)
const gameDatesForm = require('../views/gameDatesForm.html')
const gamesTemplate = require('../views/listGames.hbs')
const gamesView = Handlebars.compile(gamesTemplate)

module.exports = (divMain, session) => {
    divMain.innerHTML = focaIndexView(session)
    if (!session.auth) return

    const divCurr = document.getElementById('divCurrentGroup')
    const divMyGroups = document.getElementById('divMyGroups')
    const divShow = document.getElementById('divShow')

    util.fetchJSON('http://localhost:3000/api/groups')
        .then(groups => {
            divMyGroups.innerHTML = groupsView(groups)

            groups.forEach(addGroupHandlers)
        })

    document
        .getElementById('btnAddGroup')
        .addEventListener('click', addGroup)

    function showGroup(group) {
        divCurr.innerHTML = groupView(group)
        const gId = group.id

        btnSetClickHandler('btnAddTeams', showTeams.bind(null, gId))
        const teams = group.teams
        if (teams.length > 0) {
            btnSetClickHandler('btnSeeGames', seeGames.bind(null, gId))
            teams.forEach(t => btnSetClickHandler('btnDeleteTeam_' + t.id, deleteTeam.bind(null, t.id)))
        }

        function deleteTeam(tId, ev) {
            ev.preventDefault()
            util.ourFetch(`http://localhost:3000/api/groups/${gId}/teams/${tId}`, 'DELETE')
                .then(() => {
                    removeElementById('team_' + tId)
                    if (document.getElementById('divTeams').innerHTML.trim() === '')
                        document.getElementById('btnViewGroup_' + gId).click()
                    divShow.innerHTML = ''
                })
        }
    }

    function seeGames(gId, ev) {
        ev.preventDefault()
        divShow.innerHTML = gameDatesForm

        btnSetClickHandler('btnShowGames', showGames)

        async function showGames(ev) {
            ev.preventDefault()

            const from = document.getElementById('inputDateFrom').value
            const to = document.getElementById('inputDateTo').value
            if (from === '') util.showAlert('Insert date from!')
            else if (to === '') util.showAlert('Insert date to!')
            else if (!util.validateDateInterval(from, to)) util.showAlert('Invalid dates.')
            else {
                const games = await util.fetchJSON(`http://localhost:3000/api/groups/${gId}/matches?from=${from}&to=${to}`)
                games.forEach(game => game.date = game.date.split('T')[0])
                document.getElementById('divListGames').innerHTML = games.length > 0 ? gamesView(games) : 'No games found.'
            }

        }

    }

    function showTeams(gId, ev) {
        ev.preventDefault()

        util.fetchJSON('http://localhost:3000/api/leagues')
            .then(leagues => {
                divShow.innerHTML = listLeaguesView(leagues)
                leagues.forEach(l => btnSetClickHandler('btnleague_' + l.id, expandBtn.bind(null, l.id)))
            })
            .catch(err => util.showAlert(err))


        function expandBtn(lId, ev) {
            ev.preventDefault()
            const td = document.getElementById('leagueTeams_' + lId)
            util.fetchJSON('http://localhost:3000/api/leagues/' + lId + '/teams')
                .then(teams => {
                    td.innerHTML = teamsView(teams)
                    teams.forEach(t => btnSetClickHandler('btnAddTeam_' + t.id, addTeam.bind(null, t.id)))
                })
                .catch(() => td.innerHTML = 'No teams found for this league!')
        }

        function addTeam(tId, ev) {
            ev.preventDefault()
            util.ourFetch(`http://localhost:3000/api/groups/${gId}/teams/${tId}`, 'PUT')
                .then(() => document.getElementById('btnViewGroup_' + gId).click())
        }
    }

    function addGroup(ev) {
        ev.preventDefault()
        divCurr.innerHTML = addGroupView
        document
            .getElementById('buttonCreateGroup')
            .addEventListener('click', createGroup)
        divShow.innerHTML = ''
    }

    async function createGroup(ev) {
        ev.preventDefault()
        const name = document.getElementById('inputGroupName').value
        const description = document.getElementById('inputGroupDescription').value

        if (name === '') util.showAlert('Insert group name!')
        else if (description === '') util.showAlert('Insert group description')
        else {
            const group = {
                name,
                description
            }
            const resp = await util.ourFetch('http://localhost:3000/api/groups', 'POST', group)
            if (resp.status == 201) {
                const body = await resp.json()
                removeElementById('noGroups')

                group.id = body._id
                group.teams = []
                divMyGroups.insertAdjacentHTML('beforeend', groupsView([group]))
                addGroupHandlers(group)

                showGroup(group)
            } else util.showAlert('Error adding group.')
        }
    }

    async function deleteGroup(gId, ev) {
        ev.preventDefault()
        const resp = await util.ourFetch(`http://localhost:3000/api/groups/${gId}`, 'DELETE')
        if (resp.status == 200) removeElementById('group_' + gId)
        if (divMyGroups.innerHTML.trim() === '') divMyGroups.innerHTML = groupsView()
        divCurr.innerHTML = ''
        divShow.innerHTML = ''
    }

    async function viewGroup(gId, ev) {
        ev.preventDefault()
        const group = await util.fetchJSON(`http://localhost:3000/api/groups/${gId}`)
        group.id = gId
        if (!document.getElementById('currGroup_' + gId))
            divShow.innerHTML = ''
        showGroup(group)
    }

    async function editGroup(gId, ev) {
        ev.preventDefault()
        const group = await util.fetchJSON(`http://localhost:3000/api/groups/${gId}`)
        divCurr.innerHTML = editGroupView(group)
        btnSetClickHandler('btnSaveGroup', saveGroup.bind(null, gId))
        divShow.innerHTML = ''
    }

    async function saveGroup(gId, ev) {
        ev.preventDefault()
        const grpName = document.getElementById('inputGroupName').value
        const grpDesc = document.getElementById('inputGroupDescription').value

        if (grpName === '') util.showAlert('Insert group name!')
        else if (grpDesc === '') util.showAlert('Insert group description!')
        else {
            const grp = {
                'name': grpName,
                'description': grpDesc
            }

            const resp = await util.ourFetch(`http://localhost:3000/api/groups/${gId}`, 'PUT', grp)
            if (resp.status == 200) {
                document.getElementById('groupName_' + gId).innerHTML = grp.name
                document.getElementById('btnViewGroup_' + gId).click()
            } else util.showAlert('Error updating group.')
        }

    }

    function addGroupHandlers(group) {
        const gId = group.id
        btnSetClickHandler('btnDeleteGroup_' + gId, deleteGroup.bind(null, gId))
        btnSetClickHandler('btnViewGroup_' + gId, viewGroup.bind(null, gId))
        btnSetClickHandler('btnEditGroup_' + gId, editGroup.bind(null, gId))
    }
}

function btnSetClickHandler(id, handler) {
    document
        .getElementById(id)
        .addEventListener('click', handler)
}

function removeElementById(id) {
    const elm = document.getElementById(id)
    if (elm) elm.parentNode.removeChild(elm)
}