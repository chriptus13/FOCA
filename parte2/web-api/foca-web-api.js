'use strict'

module.exports = (app, foca) => {

    app.get('/api/leagues', getLeagues)
    app.get('/api/leagues/:lId/teams', getTeamsFromLeague)
    app.get('/api/groups/:gId', getGroup)
    app.get('/api/groups', getGroups)
    app.get('/api/groups/:gId/matches', getGamesOfGroup)

    app.post('/api/groups', createGroup)

    app.put('/api/groups/:gId', updateGroup)
    app.put('/api/groups/:gId/teams/:tId', addTeamToGroup)

    app.delete('/api/groups/:gId', deleteGroup)
    app.delete('/api/groups/:gId/teams/:tId', deleteTeamFromGroup)

    app.use(resourceNotFound)
    app.use(errorHandler)

    /**
     * Obter a lista de todas as ligas
     */
    function getLeagues(_, res, next) {
        foca.getLeagues()
            .then(leagues => setResponse(res, leagues))
            .catch(next)
    }

    /**
     * Obter as equipas de uma determinada liga
     */
    function getTeamsFromLeague(req, res, next) {
        const leagueId = req.params.lId
        foca.getTeams(leagueId)
            .then(teams => setResponse(res, teams))
            .catch(next)
    }

    /**
     * Criar grupo atribuindo-lhe um nome e descrição
     */
    function createGroup(req, res, next) {
        const body = req.body
        foca.createGroup(body.name, body.description)
            .then(groupId => setResponse(res, { '_id': groupId, '_path': `/api/groups/${groupId}` }, 201))
            .catch(next)
    }

    /**
     * Editar grupo, alterando o seu nome e descrição
     */
    function updateGroup(req, res, next) {
        const groupId = req.params.gId
        const body = req.body
        foca.updateGroup(groupId, body.name, body.description)
            .then(() => setResponse(res, { '_id': groupId, '_path': `/api/groups/${groupId}` }))
            .catch(next)
    }

    /**
     * Remove o grupo especificado. 
     */
    function deleteGroup(req, res, next) {
        const groupId = req.params.gId
        foca.deleteGroup(groupId)
            .then(() => setResponse(res))
            .catch(next)
    }

    /**
     * Obter informação de um grupo 
     */
    function getGroup(req, res, next) {
        const groupId = req.params.gId
        foca.getGroup(groupId)
            .then(group => setResponse(res, group))
            .catch(next)
    }

    /**
     * Obter informação de todos os grupos 
     */
    function getGroups(_, res, next) {
        foca.getGroups()
            .then(groups => setResponse(res, groups))
            .catch(next)
    }

    /**
     * Adicionar uma equipa a um grupo
     */
    function addTeamToGroup(req, res, next) {
        const groupId = req.params.gId
        const teamId = req.params.tId
        foca.addTeamToGroup(groupId, teamId)
            .then(team => setResponse(res, team))
            .catch(next)
    }

    /**
     * Remover uma equipa de um grupo
     */
    function deleteTeamFromGroup(req, res, next) {
        const groupId = req.params.gId
        const teamId = req.params.tId
        foca.deleteTeamFromGroup(groupId, teamId)
            .then(deletedTeam => setResponse(res, deletedTeam))
            .catch(next)
    }

    /**
     * Obter os jogos das equipas de um grupo entre duas datas. 
     */

    function getGamesOfGroup(req, res, next) {
        const groupId = req.params.gId
        const from = req.query.from
        const to = req.query.to
        foca.getGamesOfGroup(groupId, from, to)
            .then(matches => setResponse(res, matches))
            .catch(next)
    }

    function resourceNotFound(req, res, next) {
        next({ message: 'Resource not found.', statusCode: 404 })
    }

    function errorHandler(err, req, res, next) {
        setResponse(res, err, err.statusCode, err.message)
    }
}

function setResponse(res, body, statusCode = 200, statusMessage) {
    if (body) res.setHeader('Content-Type', 'application/json')
    res.statusCode = statusCode
    res.statusMessage = statusMessage
    res.end(body ? JSON.stringify(body) : undefined)
}