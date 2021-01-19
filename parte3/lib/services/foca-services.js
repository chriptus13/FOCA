'use strict'

module.exports = class FocaServices {
    constructor(focaDB, footballDB) {
        this.focaDB = focaDB
        this.footballDB = footballDB
    }

    /**
     * Initializes and returns an instance of FocaServices based on 
     * the given FocaDB and FootballData instances
     * @param {Object} focaDB - FocaDB instance 
     * @param {Object} footballDB - FootballData instance
     * @returns {Object} FocaServices instance
     */
    static init(focaDB, footballDB) {
        return new FocaServices(focaDB, footballDB)
    }

    /**
     * Obtains an array containing all the leagues
     * @returns {Promise} Promise representing an array of leagues
     */
    getLeagues() {
        return this.footballDB.getLeagues()
    }

    /**
     * Obtains an array containing all the teams in the league with the given id
     * @param {String} id - League id
     * @returns {Promise} Promise representing an array of teams
     */
    getTeams(id) {
        return this.footballDB.getTeams(id)
    }

    /**
     * Creates a new group for the user with the given userId with the given name and description and obtains its id
     * @param {String} userId - User id
     * @param {String} name - Name for the new group
     * @param {String} description - Description for the new group
     * @returns {Promise} Promise representing the id of the newly created group
     */
    createGroup(userId, name, description) {
        if (!userId || !name || !description) return Promise.reject({ message: 'Invalid or missing parameters.', statusCode: 400 })
        return this.focaDB.createGroup(userId, name, description)
    }

    /**
     * Updates the group based on the given id with the given name and description from
     * the user with the given userId
     * @param {String} userId - User id
     * @param {String} id - Group id
     * @param {String} name - New group name
     * @param {String} description - New group description
     * @returns {Promise} Promise representing the successfulness
     */
    updateGroup(userId, id, name, description) {
        if (!userId || !name || !description) return Promise.reject({ message: 'Invalid or missing parameters.', statusCode: 400 })

        return this.focaDB.getGroup(id)
            .then(group => {
                if(group.userId != userId) throw { message: 'Group not found.', statusCode: 404 }
                group.name = name
                group.description = description
                return this.focaDB.updateGroup(id, group)
            })
    }

    /**
     * Deletes a group based on the given id from the user with the given userId
     * @param {String} userId - User id
     * @param {String} id - Group id
     * @returns {Promise} Promise representing the successfulness 
     */
    deleteGroup(userId, id) {
        return this.focaDB.getGroup(id)
            .then(group => {
                if(group.userId != userId) throw { message: 'Group not found.', statusCode: 404 }
                return this.focaDB.deleteGroup(id)
            })
    }

    /**
     * Obtains the group with the given id from the user with the given userId
     * @param {String} userId - User id
     * @param {String} id  - Group id
     * @returns {Promise} Promise representing the group with the given id
     */
    getGroup(userId, id) {
        return this.focaDB.getGroup(id)
            .then(group => {
                if(group.userId != userId) throw { message: 'Group not found.', statusCode: 404 }
                return group
            })
    }

    /**
     * Obtains an array with all the groups from the user with the given userId
     * @param {String} userId - User id
     * @returns {Promise} Promise representing an array of groups
     */
    getGroups(userId) {
        return this.focaDB.getGroups(userId)
    }

    /**
     * Adds a team with the given teamID to the group with the given groupID from
     * the user with the given userId
     * @param {String} userId - User id
     * @param {String} groupID - Group id
     * @param {String} teamID - Team id
     * @returns {Promise} Promise representing the team added to the group
     */
    addTeamToGroup(userId, groupID, teamID) {
        return this.focaDB.getGroup(groupID)
            .then(group => {
                if(group.userId != userId) throw { message: 'Group not found.', statusCode: 404 }
                return Promise.all([this.footballDB.getTeam(teamID), group])
            })
            .then(([team, group]) => {
                if (group.teams.filter(t => t.id == team.id).length > 0) return team
                group.teams.push(team)
                return this.focaDB.updateGroup(groupID, group).then(() => team)
            })
    }

    /**
     * Deletes the team with the given teamID from the group with the given groupID from
     * the user with the given userId
     * @param {String} userId - User id
     * @param {String} groupID - Group id 
     * @param {String} teamID - Team id
     * @returns {Promise} Promise representing the deleted team
     */
    deleteTeamFromGroup(userId, groupID, teamID) {
        return this.focaDB.getGroup(groupID)
            .then(group => {
                if(group.userId != userId) throw { message: 'Group not found.', statusCode: 404 }
                let deletedTeam
                const teamsFiltered = group.teams.filter(team => {
                    if (team.id != teamID) return true
                    deletedTeam = team
                    return false
                })
                //Team not in the group
                if (!deletedTeam) return Promise.reject({ message: 'Team not found.', statusCode: 404 })
                group.teams = teamsFiltered
                return this.focaDB.updateGroup(groupID, group).then(() => deletedTeam)
            })
    }

    /**
     * Obtains an array of matches ordered by date containing all the matches from all the teams in the 
     * group with the given groupID between the dates [from, to] from the user with the given userId
     * @param {String} userId - User id
     * @param {String} groupID - Group id
     * @param {String} from - Begin date in String format
     * @param {String} to - End date in String format
     * @returns {Promise} Promise representing an array of matches ordered by date
     */
    getGamesOfGroup(userId, groupID, from, to) {
        return this.focaDB.getGroup(groupID)
            .then(group => {
                if(group.userId != userId) throw { message: 'Group not found.', statusCode: 404 }
                return group.teams
            })
            .then(teams => Promise.all(teams.map(team => this.footballDB.getTeamGames(team.id, from, to))))
            .then(teamsMatches => {
                const matches = []
                teamsMatches.forEach(arr => arr.forEach(match => matches.push(match)))
                return matches
                    .filter((curr, idx, self) => self.indexOf(curr) == idx)
                    .sort((m1, m2) => m1.date - m2.date)
            })
    }
}