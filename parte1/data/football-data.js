'use strict'
const request = require('request')

module.exports = class FootballData {
    constructor(apiKey) {
        this.url = 'http://api.football-data.org/v2'
        this.apiKey = apiKey
    }

    static init(apiKey) {
        return new FootballData(apiKey)
    }

    getLeagues(cb) {
        const uri = makeUri(`${this.url}/competitions`, this.apiKey)
        request.get(uri, (err, _, data) => {
            if (err) return cb({ message: 'Football API inaccessible.', code: 503 })
            cb(null, data.competitions.map(comp => ({
                'id': comp.id,
                'area': comp.area.name,
                'name': comp.name
            })))
        })
    }

    getTeams(id, cb) {
        const uri = makeUri(`${this.url}/competitions/${id}/teams`, this.apiKey)
        request.get(uri, (err, res, league) => {
            if (err) return cb({ message: 'Football API inaccessible.', code: 503 })
            if (res.statusCode != 200) return cb({ message: 'League not found.', code: 404 })
            cb(null, league.teams.map(team => ({
                'id': team.id,
                'name': team.name,
                'shortName': team.shortName,
                'tla': team.tla,
                'venue': team.venue
            })))
        })
    }

    getTeam(id, cb) {
        const uri = makeUri(`${this.url}/teams/${id}`, this.apiKey)
        request.get(uri, (err, res, team) => {
            if (err) return cb({ message: 'Football API inaccessible.', code: 503 })
            if (res.statusCode != 200) return cb({ message: 'Team not found.', code: 404 })
            cb(null, {
                'id': team.id,
                'name': team.name,
                'shortName': team.shortName,
                'tla': team.tla,
                'venue': team.venue
            })
        })
    }

    getTeamGames(teamId, from, to, cb) {
        const uri = makeUriWithDateQueries(`${this.url}/teams/${teamId}/matches`, this.apiKey, from, to)
        request.get(uri, (err, res, data) => {
            if (err) return cb({ message: 'Football API inaccessible.', code: 503 })
            if (res.statusCode != 200) return cb({ message: 'Team not found.', code: 404 })
            cb(null, data.matches.map(match => ({
                'id': match.id,
                'date': new Date(match.utcDate),
                'homeTeam': {
                    'id': match.homeTeam.id,
                    'name': match.homeTeam.name
                },
                'awayTeam': {
                    'id': match.awayTeam.id,
                    'name': match.awayTeam.name
                }
            })))
        })
    }
}

function makeUri(uri, key) {
    const obj = {
        'uri': uri,
        'json': true,
        'headers': {
            'Accept-Charset': 'utf-8',
            'X-Auth-Token': key
        }
    }
    return obj
}

function makeUriWithDateQueries(uri, key, from, to) {
    const obj = makeUri(uri, key)
    obj.qs = {
        'dateFrom': from,
        'dateTo': to
    }
    return obj
}