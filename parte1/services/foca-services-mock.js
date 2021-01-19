'use strict'

class FocaServices{
    static init(){
        return new FocaServices()
    }

    getLeagues(cb){
        return cb(null, leagues)
    }

    getTeams(id, cb){
        const teams = teamsOfLeagues[id]
        if(!teams)
            return cb({message: 'League not found.', code: 404})
        cb(null, teams.teams)
    }

    createGroup(name, description, cb){
        if(!name || !description)
            return cb({message: 'Invalid or missing parameters', code: 400})
        const id = count ++
        groups[id] = {
            'name': name,
            'description': description,
            'teams': []
        }
        cb(null, id)
    }

    updateGroup(id, name, description, cb){
        if(!name || !description)
            return cb({message: 'Invalid or missing parameters', code: 400})
        const group = groups[id]
        if(!group)
            return cb({message: 'Group not found.', code: 404})
        group.name = name
        group.description = description
        cb(null, id)
    }

    getGroup(id, cb) {
        const group = groups[id]
        if(!group)
            return cb({message: 'Group not found.', code: 404})
        cb(null, group)
    }

    getGroups(cb) {
        const resGroups = []
        for(let i = 0; i <count; i++)
            if(groups[i]!=undefined)
                resGroups.push(groups[i])
        cb(null, resGroups)
    }

    addTeamToGroup(groupID, teamID, cb){
        const group = groups[groupID]
        const team = teams[teamID]
        if(!group || !team) 
            return cb({message: 'Group or team not found.', code: 404})
        group.teams.push(team)
        cb(null, team)
    }

    deleteTeamFromGroup(groupID, teamID, cb){
        const group = groups[groupID]
        let teamRemoved
        if(!group) return cb({message: 'Group not found.', code: 404})
        const teamsFiltered = group.teams.filter(team=>{
            if(team.id!=teamID) return true
            teamRemoved = team
            return false
        })
        if(teamsFiltered.length == group.teams.length) return cb({message: 'Team not found.', code: 404})
        group.teams = teamsFiltered
        cb(null, teamRemoved)
    }

    getGamesOfGroup(groupID, from, to, cb){
        const group = groups[groupID]
        if(!group) return cb({message: 'Group not found.', code: 404})
        const dateFrom = new Date(from)
        const dateTo = new Date(to)
        const matchesRes = []
        group.teams.forEach(team=>{
            matches.forEach(game=>{
                if(equalsTeams(team, game.awayTeam, game.homeTeam) && 
                    dateBetweenInterval(new Date(game.date), dateFrom, dateTo))
                    matchesRes.push(game)
            })
        })
        cb(null, matchesRes)
    }

    deleteGroup(id, cb){
        const group = groups[id]
        if(!group) return cb({message: 'Group not found.', code: 404})
        delete groups[id]
        cb(null, group)
    }
}

function equalsTeams(team, team1, team2){
    if(team.id==team1.id || team.id==team2.id) return true
    return false
}

function dateBetweenInterval(date, dateFrom, dateTo){
    if(date>dateFrom && date<dateTo) return true
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

module.exports = FocaServices