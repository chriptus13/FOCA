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
    it('Should get leagues', done => {
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
        foca.getLeagues((err, leagues) => {
            if(err) assert.fail('Not supposed to fail')
            leaguesExpected.forEach(league => assert.equal(leagues.filter(i=>i.id===league.id).length, 1))
            done()
        })
    })

    it('Should get teams of a league', done => {
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
        
        foca.getTeams('2017', (err, teams) => {
            if(err) assert.fail('Not supposed to fail')
            teamsExpected.forEach(team => assert.equal(teams.filter(i=>i.id===team.id).length, 1))
            done()
        })
    })

    it('Should fail trying to get teams of unexistent league', done => {
        foca.getTeams('-1', (err) => {
            if(!err) assert.fail('Supposed to fail with error 404')
            assert.equal(err.code, 404)
            done()
        })
    })

    it('Should create group', done => {
        foca.createGroup('TestName', 'TestDescription', (err, body) => {
            if(err) assert.fail('Not supposed to fail')
            assert.notEqual(body, undefined)
            foca.deleteGroup(body, () => done())
        })
    })

    it('Should update group', done => {
        foca.createGroup('TestName', 'TestDescription', (err, body) => {
            const id = body
            foca.updateGroup(id, 'NewName', 'NewDescription', (err, body) => {
                if(err) assert.fail('Not supposed to fail')
                foca.deleteGroup(id, () => done())
            })
        })
    })

    it('Should fail trying update unexistent group', done => {
        foca.updateGroup(-1, 'Name', 'Description', (err) => {
            if(!err) assert.fail('Supposed to fail with error 404')
            assert.equal(err.code, 404)
            done()
        })
    })

    it('Should get list of groups', done => {
        const g1 = {
            'name': 'G1Name',
            'description': 'G1Description'
        }
        const g2 = {
            'name': 'G2Name',
            'description': 'G2Description'
        }
        const expectedGroups = [g1, g2]
        foca.createGroup(g1.name, g1.description, (err, body) => {
            const g1Id = body
            foca.createGroup(g2.name, g2.description, (err, body) => {
                const g2Id = body
                foca.getGroups((err, groups) => {
                    if(err) assert.fail('Not supposed to fail')
                    expectedGroups.forEach(group => {
                        assert.notEqual(groups.filter(i => 
                            i.name==group.name && i.description == group.description).length, 0)
                    })
                    foca.deleteGroup(g1Id, () =>
                        foca.deleteGroup(g2Id, () => done())
                    )
                })
            })
        })
    })

    it('Should get a group', done => {
        const expectedGroup = {
            'name': 'Name',
            'description': 'Description'
        }
        foca.createGroup(expectedGroup.name, expectedGroup.description, (err, body) => {
            const id = body
            foca.getGroup(id, (err, group) => {
                if(err) assert.fail('Not supposed to fail')
                assert.equal(group.name, expectedGroup.name)
                assert.equal(group.description, expectedGroup.description)
                foca.deleteGroup(id, () => done())
            })
        })
    })

    it('Should fail trying to get unexistent group', done => {
        foca.getGroup(-1, (err) => {
            if(!err) assert.fail('Supposed to fail with error 404')
            assert.equal(err.code, 404)
            done()
        })
    })

    it('Should add team to a group', done => {
        const expectedTeam = {
            'id': 503,
            'name': 'FC Porto',
            'shortName': 'Porto',
            'tla': 'POR',
            'venue': 'Estádio Do Dragão'
        }
        foca.createGroup('Name', 'Description', (err, body) => {
            const id = body
            foca.addTeamToGroup(id, expectedTeam.id, (err, team) => {
                if(err) assert.fail('Not supposed to fail')
                assert.deepStrictEqual(team, expectedTeam)
                foca.getGroup(id, (err, group) => {
                    assert.deepStrictEqual(group.teams, [expectedTeam])
                    foca.deleteGroup(id, () => done())    
                })
            })
        })
    })

    it('Should fail trying to add unexistent team to a group', done => {
        foca.createGroup('...', '...', (err, body) => {
            const id = body
            foca.addTeamToGroup(id, -1, (err) => {
                if(!err) assert.fail('Supposed to fail with error 404')
                assert.equal(err.code, 404)
                foca.deleteGroup(id, () => done())
            })
        })
    })

    it('Should delete team of a group', done => {
        const expectedTeam = {
            'id': 503,
            'name': 'FC Porto',
            'shortName': 'Porto',
            'tla': 'POR',
            'venue': 'Estádio Do Dragão'
        }
        foca.createGroup('...', '...', (err, body) => {
            const groupID = body
            foca.addTeamToGroup(groupID, expectedTeam.id, () => {
                foca.deleteTeamFromGroup(groupID, expectedTeam.id, (err, team) => {
                    if(err) assert.fail('Not supposed to fail')
                    assert.deepStrictEqual(team, expectedTeam)
                    foca.getGroup(groupID, (err, group) => {
                        assert.deepStrictEqual(group.teams, [])
                        foca.deleteGroup(groupID, () => done())    
                    })
                })
            })
        })
    })

    it('Should fail trying delete team that is not part of a group', done => {
        foca.createGroup('...', '...', (err, body) => {
            const id = body
            foca.deleteTeamFromGroup(id, -1, (err) => {
                if(!err) assert.fail('Supposed to fail with error 404')
                assert.equal(err.code, 404)
                foca.deleteGroup(id, () => done())
            })
        })
    })


    it('Should get all matches of teams in a group', done => {
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
        foca.createGroup('...', '...', (err, body) => {
            const groupID = body
            const teamID = 503
            foca.addTeamToGroup(groupID, teamID, () => {
                foca.getGamesOfGroup(groupID, '2018-11-01', '2018-11-05', (err, matches) => {
                    if(err) assert.fail('Not supposed to fail')
                    assert.deepStrictEqual(matches, [expectedMatch])
                    foca.deleteGroup(groupID, () => done())
                })
            })
        })
    })

    it('Should get an empty array trying to get all matches of teams in a group because of date limits', done => {
        foca.createGroup('...', '...', (err, body) => {
            const groupID = body
            const teamID = 503
            foca.addTeamToGroup(groupID, teamID, () => {
                foca.getGamesOfGroup(groupID, '2018-11-04', '2018-11-05', (err, matches) => {
                    if(err) assert.fail('Not supposed to fail')
                    assert.deepStrictEqual(matches, [])
                    foca.deleteGroup(groupID, () => done())
                })
            })
        })
    })
    
})