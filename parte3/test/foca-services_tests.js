'use strict'

const assert = require('assert')


// foca-db-mock and football-data-mock
/**/
const focaDB = require('../lib/data/foca-db-mock').init()
const footballDB = require('../lib/data/football-data-mock').init()
const foca = require('../lib/services/foca-services').init(focaDB, footballDB)
/**/

// foca-service-mock
/*
const foca = require('../lib/services/foca-services-mock').init()
*/

// real foca-db and football-data
/*
const es = {
    host: 'localhost',
    port: 9200,
    groups_index: 'groups/group'
}
const focaDB = require('../lib/data/foca-db').init(es)
const authKey = '<API_KEY>'
const footballDB = require('../lib/data/football-data').init(authKey)
const foca = require('../lib/services/foca-services').init(focaDB, footballDB)
*/

describe('Foca Services Test', () => {
    it('Should get leagues', async () => {
        const leaguesExpected = [
            {
                'id': 2017,
                'area': 'Portugal',
                'name': 'Primeira Liga'
            },
            {
                'id': 2014,
                'area': 'Spain',
                'name': 'Primera Division'
            }
        ]

        try {
            const leagues = await foca.getLeagues()
            leaguesExpected.forEach(league => assert.equal(leagues.filter(l => l.id == league.id).length, 1))
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should get teams of a league', async () => {
        const teamsExpected = [{
            "id": 503,
            "name": "FC Porto",
            "shortName": "Porto",
            "tla": "POR",
            "venue": "Estádio Do Dragão"
        },
        {
            "id": 498,
            "name": "Sporting Clube de Portugal",
            "shortName": "Sporting CP",
            "tla": "SPO",
            "venue": "Estádio José Alvalade"
        }]
        try {
            const teams = await foca.getTeams('2017')
            teamsExpected.forEach(team => assert.equal(teams.filter(t => t.id === team.id).length, 1))
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying to get teams of unexistent league', async () => {
        try {
            await foca.getTeams('-1')
        } catch (err) {
            assert.equal(err.statusCode, 404)
            return
        }
        assert.fail('Supposed to fail with error 404')
    })

    it('Should create group', async () => {
        try {
            const id = await foca.createGroup('userId', 'TestName', 'TestDescription')
            assert.notEqual(id, undefined)
            await foca.deleteGroup('userId', id)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should update group', async () => {
        let id
        try {
            id = await foca.createGroup('userId', 'TestName', 'TestDescription')
            await foca.updateGroup('userId', id, 'NewName', 'NewDescription')
            const group = await foca.getGroup('userId', id)
            assert.equal(group.name, 'NewName')
            assert.equal(group.description, 'NewDescription')
            await foca.deleteGroup('userId', id)
        } catch (err) {
            await foca.deleteGroup('userId', id)
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying update unexistent group', async () => {
        try {
            await foca.updateGroup('userId', 'invalid', 'Name', 'Description')
        } catch (err) {
            assert.equal(err.statusCode, 404)
            return
        }
        assert.fail('Supposed to fail with error 404')
    })

    it('Should get list of groups', async () => {
        const expectedGroups = [
            {
                'name': 'G1Name',
                'description': 'G1Description'
            },
            {
                'name': 'G2Name',
                'description': 'G2Description'
            }
        ]
        let g1Id, g2Id
        try {
            g1Id = await foca.createGroup('userId', expectedGroups[0].name, expectedGroups[0].description)
            g2Id = await foca.createGroup('userId', expectedGroups[1].name, expectedGroups[1].description)
            const groups = await foca.getGroups('userId')
            expectedGroups.forEach(group =>
                assert.notEqual(groups.filter(g => g.name == group.name && g.description == group.description).length, 0)
            )
            await foca.deleteGroup('userId', g1Id)
            await foca.deleteGroup('userId', g2Id)
        } catch (err) {
            await foca.deleteGroup('userId', g1Id)
            await foca.deleteGroup('userId', g2Id)
            assert.fail('Not supposed to fail')
        }
    })

    it('Should get a group', async () => {
        const expectedGroup = {
            'name': 'Name',
            'description': 'Description'
        }
        let id
        try {
            id = await foca.createGroup('userId', expectedGroup.name, expectedGroup.description)
            const group = await foca.getGroup('userId', id)
            assert.equal(group.name, expectedGroup.name)
            assert.equal(group.description, expectedGroup.description)
            await foca.deleteGroup('userId', id)
        } catch (err) {
            await foca.deleteGroup('userId', id)
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying to get unexistent group', async () => {
        try {
            await foca.getGroup('userId', 'Invalid')
        } catch (err) {
            assert.equal(err.statusCode, 404)
            return
        }
        assert.fail('Supposed to fail with error 404')
    })

    it('Should add team to a group', async () => {
        const expectedTeam = {
            'id': 503,
            'name': 'FC Porto',
            'shortName': 'Porto',
            'tla': 'POR',
            'venue': 'Estádio Do Dragão'
        }
        let id
        try {
            id = await foca.createGroup('userId', 'Name', 'Description')
            const team = await foca.addTeamToGroup('userId', id, expectedTeam.id)
            assert.deepStrictEqual(team, expectedTeam)
            const group = await foca.getGroup('userId', id)
            assert.deepStrictEqual(group.teams, [expectedTeam])
            await foca.deleteGroup('userId', id)
        } catch (err) {
            await foca.deleteGroup('userId', id)
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying to add unexistent team to a group', async () => {
        let groupID
        try {
            groupID = await foca.createGroup('userId', '...', '...')
            await foca.addTeamToGroup('userId', groupID, 'Invalid')
        } catch (err) {
            await foca.deleteGroup('userId', groupID)
            assert.equal(err.statusCode, 404)
            return
        }
        await foca.deleteGroup('userId', groupID)
        assert.fail('Supposed to fail with error 404')
    })

    it('Should delete team of a group', async () => {
        const expectedTeam = {
            'id': 503,
            'name': 'FC Porto',
            'shortName': 'Porto',
            'tla': 'POR',
            'venue': 'Estádio Do Dragão'
        }
        let groupID
        try {
            groupID = await foca.createGroup('userId', '...', '...')
            const team = await foca.addTeamToGroup('userId', groupID, expectedTeam.id)
            assert.deepStrictEqual(team, expectedTeam)
            let group = await foca.getGroup('userId', groupID)
            assert.deepStrictEqual(group.teams, [expectedTeam])
            const deletedTeam = await foca.deleteTeamFromGroup('userId', groupID, expectedTeam.id)
            assert.deepStrictEqual(deletedTeam, expectedTeam)
            group = await foca.getGroup('userId', groupID)
            assert.deepStrictEqual(group.teams, [])
            await foca.deleteGroup('userId', groupID)
        } catch (err) {
            await foca.deleteGroup('userId', groupID)
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying delete team that is not part of a group', async () => {
        let groupID
        try {
            groupID = await foca.createGroup('userId', '...', '...')
            await foca.deleteTeamFromGroup('userId', groupID, 'Invalid')
        } catch (err) {
            await foca.deleteGroup('userId', groupID)
            assert.equal(err.statusCode, 404)
            return
        }
        await foca.deleteGroup('userId', groupID)
        assert.fail('Supposed to fail with error 404')
    })

    it('Should get all matches of teams in a group', async () => {
        const expectedMatch = {
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
        }
        let groupID
        try {
            groupID = await foca.createGroup('userId', '...', '...')
            await foca.addTeamToGroup('userId', groupID, 503)
            const matches = await foca.getGamesOfGroup('userId', groupID, '2018-11-01', '2018-11-05')
            assert.equal(matches.length, 1)
            const m = matches[0]
            assert.equal(m.id, expectedMatch.id)
            assert.equal(m.homeTeam.id, expectedMatch.homeTeam.id)
            assert.equal(m.awayTeam.id, expectedMatch.awayTeam.id)
            await foca.deleteGroup('userId', groupID)
        } catch (err) {
            await foca.deleteGroup('userId', groupID)
            assert.fail('Not supposed to fail')
        }
    })

    it('Should get an empty array trying to get all matches of teams in a group because of date limits', async () => {
        let groupID
        try {
            groupID = await foca.createGroup('userId', '...', '...')
            await foca.addTeamToGroup('userId', groupID, 503)
            const matches = await foca.getGamesOfGroup('userId', groupID, '2018-11-04', '2018-11-05')
            assert.deepStrictEqual(matches, [])
            foca.deleteGroup('userId', groupID)
        } catch (err) {
            foca.deleteGroup('userId', groupID)
            assert.fail('Not supposed to fail')
        }
    })
})
