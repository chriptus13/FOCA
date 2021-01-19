'use strict'

module.exports = class FocaServices {
    static init() {
        return new FocaServices()
    }

    getLeagues() {
        return Promise.resolve(leagues)
    }

    getTeams(id) {
        const teams = teamsOfLeagues[id]
        if (!teams)
            return Promise.reject({ message: 'League not found.', statusCode: 404 })
        return Promise.resolve(teams.teams)
    }

    createGroup(name, description) {
        if (!name || !description)
            return Promise.reject({ message: 'Invalid or missing parameters', statusCode: 400 })
        const id = count++
        groups[id] = {
            'name': name,
            'description': description,
            'teams': []
        }
        return Promise.resolve(id)
    }

    updateGroup(id, name, description) {
        if (!name || !description)
            return Promise.reject({ message: 'Invalid or missing parameters', statusCode: 400 })
        const group = groups[id]
        if (!group)
            return Promise.reject({ message: 'Group not found.', statusCode: 404 })
        group.name = name
        group.description = description
        return Promise.resolve(id)
    }

    getGroup(id) {
        const group = groups[id]
        if (!group)
            return Promise.reject({ message: 'Group not found.', statusCode: 404 })
        return Promise.resolve(group)
    }

    getGroups() {
        const resGroups = []
        for (let i = 0; i < count; i++)
            if (groups[i] != undefined)
                resGroups.push(groups[i])
        return Promise.resolve(resGroups)
    }

    addTeamToGroup(groupID, teamID) {
        const group = groups[groupID]
        const team = teams[teamID]
        if (!group || !team)
            return Promise.reject({ message: 'Group or team not found.', statusCode: 404 })
        group.teams.push(team)
        return Promise.resolve(team)
    }

    deleteTeamFromGroup(groupID, teamID) {
        const group = groups[groupID]
        let teamRemoved
        if (!group)
            return Promise.reject({ message: 'Group not found.', statusCode: 404 })
        const teamsFiltered = group.teams.filter(team => {
            if (team.id != teamID) return true
            teamRemoved = team
            return false
        })
        if (teamsFiltered.length == group.teams.length)
            return Promise.reject({ message: 'Team not found.', statusCode: 404 })
        group.teams = teamsFiltered
        return Promise.resolve(teamRemoved)
    }

    getGamesOfGroup(groupID, from, to) {
        const group = groups[groupID]
        if (!group)
            return Promise.reject({ message: 'Group not found.', statusCode: 404 })
        const dateFrom = new Date(from)
        const dateTo = new Date(to)
        const matchesRes = []
        group.teams.forEach(team => {
            matches.forEach(game => {
                if (equalsTeams(team, game.awayTeam, game.homeTeam) &&
                    dateBetweenInterval(new Date(game.date), dateFrom, dateTo))
                    matchesRes.push(game)
            })
        })
        return Promise.resolve(matchesRes)
    }

    deleteGroup(id) {
        const group = groups[id]
        if (!group)
            return Promise.reject({ message: 'Group not found.', statusCode: 404 })
        delete groups[id]
        return Promise.resolve(group)
    }
}

function equalsTeams(team, team1, team2) {
    if (team.id == team1.id || team.id == team2.id) return true
    return false
}

function dateBetweenInterval(date, dateFrom, dateTo) {
    if (date > dateFrom && date < dateTo) return true
    return false
}

const leagues = [
    {
        'id': 2017,
        'area': 'Portugal',
        'name': 'Primeira Liga'
    },
    {
        'id': 2014,
        'area': 'Spain',
        'name': 'Primera Division'
    },
    {
        'id': 2021,
        'area': 'England',
        'name': 'Premier League',
    }
]

const teamsOfLeagues = {
    '2017': {
        'teams': [{
            'id': 503,
            'name': 'FC Porto',
            'shortName': 'Porto',
            'tla': 'POR',
            'venue': 'Estádio Do Dragão'
        },
        {
            'id': 498,
            'name': 'Sporting Clube de Portugal',
            'shortName': 'Sporting CP',
            'tla': 'SPO',
            'venue': 'Estádio José Alvalade'
        }]
    }
}

let count = 0
const groups = {}

const teams = {
    '503': {
        'id': 503,
        'name': 'FC Porto',
        'shortName': 'Porto',
        'tla': 'POR',
        'venue': 'Estádio Do Dragão'
    },
    '498': {
        'id': 498,
        'name': 'Sporting Clube de Portugal',
        'shortName': 'Sporting CP',
        'tla': 'SPO',
        'venue': 'Estádio José Alvalade'
    }
}

const matches = [{
    'id': 241246,
    'homeTeam': {
        'id': 5575,
        'name': 'CS Marítimo'
    },
    'awayTeam': {
        'id': 503,
        'name': 'FC Porto'
    },
    'date': '2018-11-03'
},
{
    'id': 250712,
    'homeTeam': {
        'id': 503,
        'name': 'FC Porto'
    },
    'awayTeam': {
        'id': 5455,
        'name': 'FK Lokomotiv Moskva'
    },
    'date': '2018-11-06'
}]
