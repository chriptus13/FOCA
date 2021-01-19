'use strict'
const parallel = require('../util/parallel')

module.exports = class FocaServices {
    constructor(focaDB, footballDB) {
        this.focaDB = focaDB
        this.footballDB = footballDB
    }

    static init(focaDB, footballDB) {
        return new FocaServices(focaDB, footballDB)
    }

    getLeagues(cb) {
        this.footballDB.getLeagues((err, leagues) => {
            if (err) return cb(err)
            cb(null, leagues)
        })
    }

    getTeams(id, cb) {
        this.footballDB.getTeams(id, (err, teams) => {
            if (err) return cb(err)
            cb(null, teams)
        })
    }

    createGroup(name, description, cb) {
        if (!name || !description) return cb({ message: 'Invalid or missing parameters.', code: 400 })
        this.focaDB.createGroup(name, description, (err, groupID) => {
            if (err) return cb(err)
            cb(null, groupID)
        })
    }

    updateGroup(id, name, description, cb) {
        if (!name || !description) return cb({ message: 'Invalid or missing parameters.', code: 400 })
        this.focaDB.getGroup(id, (err, group) => {
            if (err) return cb(err)
            group.name = name
            group.description = description
            this.focaDB.updateGroup(id, group, err => {
                if (err) return cb(err)
                cb(null)
            })
        })
    }

    deleteGroup(id, cb) {
        this.focaDB.deleteGroup(id, (err, group) => {
            if (err) return cb(err)
            cb(null, group)
        })
    }

    getGroup(id, cb) {
        this.focaDB.getGroup(id, (err, group) => {
            if (err) return cb(err)
            cb(null, group)
        })
    }

    getGroups(cb) {
        this.focaDB.getGroups((err, groups) => {
            if (err) return cb(err)
            cb(null, groups)
        })
    }

    addTeamToGroup(groupID, teamID, cb) {
        this.footballDB.getTeam(teamID, (err, team) => {
            if (err) return cb(err)
            this.focaDB.getGroup(groupID, (err, group) => {
                if (err) return cb(err)
                // Team already in group - no need to update it
                if (group.teams.indexOf(team) >= 0) return cb(null, team)
                group.teams.push(team)
                this.focaDB.updateGroup(groupID, group, err => {
                    if (err) return cb(err)
                    cb(null, team)
                })
            })
        })
    }

    deleteTeamFromGroup(groupID, teamID, cb) {
        this.focaDB.getGroup(groupID, (err, group) => {
            if (err) return cb(err)
            let deletedTeam
            const teamsFiltered = group.teams.filter(team => {
                if (team.id != teamID) return true
                deletedTeam = team
                return false
            })
            //Team not in the group
            if (!deletedTeam)
                return cb({ message: 'Team not found.', code: 404 })
            group.teams = teamsFiltered
            this.focaDB.updateGroup(groupID, group, err => {
                if (err) return cb(err)
                cb(null, deletedTeam)
            })
        })
    }

    getGamesOfGroup(groupID, from, to, cb) {
        this.focaDB.getGroup(groupID, (err, group) => {
            if (err) return cb(err)
            const teams = group.teams

            const tasks = []
            teams.forEach(team => {
                tasks.push(cb => {
                    this.footballDB.getTeamGames(team.id, from, to, (err, games) => {
                        if (err) return cb(err)
                        cb(null, games)
                    })
                })
            })

            parallel(tasks, (err, teamsMatches) => {
                if (err) return cb(err)
                const matches = []
                teamsMatches.forEach(arr => arr.forEach(elm => matches.push(elm)))
                cb(null, matches.filter((curr, idx, self) => {
                    return self.indexOf(curr) === idx;
                }).sort((m1, m2) => m1.date - m2.date))
            })
        })
    }
}