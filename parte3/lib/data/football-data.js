'use strict'

const rp = require('request-promise')

module.exports = class FootballData {
    constructor(apiKey) {
        this.url = 'http://api.football-data.org/v2'
        this.apiKey = apiKey
    }

    /**
     * Initializes and returns an instance of FootballData for operations in the FootballData API with the given apiKey
     * @param {String} apiKey - Authorization key for FootballData API requests. See [FootballDataAPI]{@link https://www.football-data.org}
     * @returns {Object} FootballData instance
     */
    static init(apiKey) {
        return new FootballData(apiKey)
    }

    /**
     * Obtains an array containing all the leagues
     * @returns {Promise} Promise representing an array of leagues
     */
    getLeagues() {
        const uri = makeUri(`${this.url}/competitions`, this.apiKey)
        return rp.get(uri)
            .catch(() => Promise.reject({ message: 'Football API inaccessible.', satusCode: 503 }))
            .then(data => data.competitions.map(comp => ({
                'id': comp.id,
                'area': comp.area.name,
                'name': comp.name
            })))
    }

    /**
     * Obtains an array containing all the teams in the league with the given id
     * @param {String} id - League id
     * @returns {Promise} Promise representing an array of teams
     */
    getTeams(id) {
        const uri = makeUri(`${this.url}/competitions/${id}/teams`, this.apiKey)
        return rp.get(uri)
            .catch(err =>
                Promise.reject(err.statusCode == 404 || err.statusCode == 400 ?
                    { message: 'League not found.', statusCode: 404 }
                    :
                    { message: 'Football API inaccessible.', statusCode: 503 }
                )
            )
            .then(league => league.teams.map(team => ({
                'id': team.id,
                'name': team.name,
                'shortName': team.shortName,
                'tla': team.tla,
                'venue': team.venue
            })))
    }

    /**
     * Obtains the team with the given id
     * @param {String} id - Team id 
     * @returns {Promise} Promise representing a team
     */
    getTeam(id) {
        const uri = makeUri(`${this.url}/teams/${id}`, this.apiKey)
        return rp.get(uri)
            .catch(err =>
                Promise.reject(err.statusCode == 404 || err.statusCode == 400 ?
                    { message: 'Team not found.', statusCode: 404 }
                    :
                    { message: 'Football API inaccessible.', statusCode: 503 }
                )
            )
            .then(team => ({
                'id': team.id,
                'name': team.name,
                'shortName': team.shortName,
                'tla': team.tla,
                'venue': team.venue
            }))
    }

    /**
     * Obtains an array containing all the matches from a team with the given id
     * between the dates given [from, to]
     * @param {String} teamId - Team id
     * @param {String} from - Begin date in String format
     * @param {String} to - End date in String format 
     * @returns {Promise} Promise representing an array of matches
     */
    getTeamGames(teamId, from, to) {
        const uri = makeUriWithDateQueries(`${this.url}/teams/${teamId}/matches`, this.apiKey, from, to)
        return rp.get(uri)
            .catch(err =>
                Promise.reject(err.statusCode == 404 || err.statusCode == 400 ?
                    { message: 'Team not found.', statusCode: 404 }
                    :
                    { message: 'Football API inaccessible.', statusCode: 503 }
                )
            )
            .then(data => data.matches.map(match => ({
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
    }
}

/**
 * Creates and returns the 'options' object for requests
 * @param {String} uri - URI for request
 * @param {String} key - FootballData API key
 * @returns {Object} Object with the options for the request 
 */
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

/**
 * Creates and returns the 'options' object for requests 
 * with a query for the given dates
 * @param {String} uri - URI for request 
 * @param {String} key - FootballData API key
 * @param {String} from - Begin date in String format
 * @param {String} to - End date in String format
 * @returns {Object} Object with the options for the request 
 */
function makeUriWithDateQueries(uri, key, from, to) {
    const obj = makeUri(uri, key)
    obj.qs = {
        'dateFrom': from,
        'dateTo': to
    }
    return obj
}