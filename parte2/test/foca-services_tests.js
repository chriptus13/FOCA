'use strict'

const assert = require('assert')


// foca-db-mock and football-data-mock
const focaDB = require('../data/foca-db-mock').init()
const footballDB = require('../data/football-data-mock').init()
const foca = require('../services/foca-services').init(focaDB, footballDB)


/*
// real foca-db and football-data
const es = {
    host: 'localhost',
    port: 9200,
    groups_index: 'groups/group'
}
const focaDB = require('../data/foca-db').init(es)
const authKey = '<API_KEY>'
const footballDB = require('../data/football-data').init(authKey)
const foca = require('../services/foca-services').init(focaDB, footballDB)
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
            const id = await foca.createGroup('TestName', 'TestDescription')
            assert.notEqual(id, undefined)
            await foca.deleteGroup(id)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should update group', async () => {
        try {
            const id = await foca.createGroup('TestName', 'TestDescription')
            const otherID = await foca.updateGroup(id, 'NewName', 'NewDescription')
            assert.equal(otherID, id)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying update unexistent group', async () => {
        try {
            await foca.updateGroup(-1, 'Name', 'Description')
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
        try {
            const g1Id = await foca.createGroup(expectedGroups[0].name, expectedGroups[0].description)
            const g2Id = await foca.createGroup(expectedGroups[1].name, expectedGroups[1].description)
            const groups = await foca.getGroups()
            expectedGroups.forEach(group =>
                assert.notEqual(groups.filter(g => g.name == group.name && g.description == group.description).length, 0)
            )
            await foca.deleteGroup(g1Id)
            await foca.deleteGroup(g2Id)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should get a group', async () => {
        const expectedGroup = {
            'name': 'Name',
            'description': 'Description'
        }
        try {
            const id = await foca.createGroup(expectedGroup.name, expectedGroup.description)
            const group = await foca.getGroup(id)
            assert.equal(group.name, expectedGroup.name)
            assert.equal(group.description, expectedGroup.description)
            await foca.deleteGroup(id)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying to get unexistent group', async () => {
        try {
            await foca.getGroup(-1)
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
        try {
            const id = await foca.createGroup('Name', 'Description')
            const team = await foca.addTeamToGroup(id, expectedTeam.id)
            assert.deepStrictEqual(team, expectedTeam)
            const group = await foca.getGroup(id)
            assert.deepStrictEqual(group.teams, [expectedTeam])
            await foca.deleteGroup(id)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying to add unexistent team to a group', async () => {
        let groupID
        try {
            groupID = await foca.createGroup('...', '...')
            await foca.addTeamToGroup(groupID, -1)
        } catch (err) {
            assert.equal(err.statusCode, 404)
            await foca.deleteGroup(groupID)
            return
        }
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
        try {
            const groupID = await foca.createGroup('...', '...')
            const team = await foca.addTeamToGroup(groupID, expectedTeam.id)
            assert.deepStrictEqual(team, expectedTeam)
            let group = await foca.getGroup(groupID)
            assert.deepStrictEqual(group.teams, [expectedTeam])
            const deletedTeam = await foca.deleteTeamFromGroup(groupID, expectedTeam.id)
            assert.deepStrictEqual(deletedTeam, expectedTeam)
            group = await foca.getGroup(groupID)
            assert.deepStrictEqual(group.teams, [])
            await foca.deleteGroup(groupID)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying delete team that is not part of a group', async () => {
        let groupID
        try {
            groupID = await foca.createGroup('...', '...')
            await foca.deleteTeamFromGroup(groupID, -1)
        } catch (err) {
            assert.equal(err.statusCode, 404)
            await foca.deleteGroup(groupID)
            return
        }
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
        try {
            const groupID = await foca.createGroup('...', '...')
            await foca.addTeamToGroup(groupID, 503)
            const matches = await foca.getGamesOfGroup(groupID, '2018-11-01', '2018-11-05')
            assert.deepStrictEqual(matches, [expectedMatch])
            await foca.deleteGroup(groupID)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should get an empty array trying to get all matches of teams in a group because of date limits', async () => {
        try {
            const groupID = await foca.createGroup('...', '...')
            await foca.addTeamToGroup(groupID, 503)
            const matches = await foca.getGamesOfGroup(groupID, '2018-11-04', '2018-11-05')
            assert.deepStrictEqual(matches, [])
            foca.deleteGroup(groupID)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })
})
