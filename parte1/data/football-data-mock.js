'use strict'

class FootballData {
    static init() {
        return new FootballData()
    }

    getLeagues(cb) {
        cb(null, leagues)
    }

    getTeams(id, cb) {
        const teams = teamsOfLeagues[id]
        if (!teams) return cb({ message: 'League not found.', code: 404 })
        cb(null, teams.teams)
    }

    getTeam(id, cb) {
        const team = teams[id]
        if (!team) return cb({ message: 'Team not found.', code: 404 })
        cb(null, team)
    }

    getTeamGames(teamId, from, to, cb) {
        const dateFrom = new Date(from)
        const dateTo = new Date(to)
        const matchesRes = []
        matches.forEach(match => {
            if (equalsTeams(teamId, match.awayTeam, match.homeTeam) &&
                dateBetweenInterval(new Date(match.date), dateFrom, dateTo))
                matchesRes.push(match)
        })
        cb(null, matchesRes)
    }
}

function equalsTeams(teamId, team1, team2) {
    if (teamId == team1.id || teamId == team2.id) return true
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

const teams = {
    '503': {
        'id': 503,
        'name': 'FC Porto',
        'shortName': 'Porto',
        'tla': 'POR',
        'venue': 'Estádio Do Dragão'
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
    'date': new Date('2018-11-03T18:00:00.000Z')
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
    'date': new Date('2018-11-06T18:00:00.000Z')
}]

module.exports = FootballData