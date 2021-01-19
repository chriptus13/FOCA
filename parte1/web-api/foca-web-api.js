'use strict'

module.exports = (router, foca) => {

    router.get('/api/leagues', getLeagues)
    router.get('/api/leagues/:lId/teams', getTeamsFromLeague)
    router.get('/api/groups/:gId', getGroup)
    router.get('/api/groups', getGroups)
    router.get('/api/groups/:gId/matches', getGamesOfGroup)

    router.post('/api/groups', createGroup)

    router.put('/api/groups/:gId', updateGroup)
    router.put('/api/groups/:gId/teams/:tId', addTeamToGroup)

    router.delete('/api/groups/:gId', deleteGroup)
    router.delete('/api/groups/:gId/teams/:tId', deleteTeamFromGroup)

    router.errorHandler(resourceNotFound)

    /**
     * Obter a lista de todas as ligas
     */
    function getLeagues(_, res, next) {
        foca.getLeagues(focaCallback.bind(null, res, next))
    }

    /**
     * Obter as equipas de uma determinada liga
     */
    function getTeamsFromLeague(req, res, next) {
        const leagueId = req.parms.lId

        foca.getTeams(leagueId, focaCallback.bind(null, res, next))
    }

    /**
     * Criar grupo atribuindo-lhe um nome e descrição
     */
    function createGroup(req, res, next) {
        let body = ''

        req.on('data', data => body += data.toString())
        req.on('end', () => {
            try {
                body = JSON.parse(body)
                foca.createGroup(body.name, body.description, (err, groupId) => {
                    if (!checkError(next, err))
                        setResponse(res, { '_id': groupId, '_path': `/api/groups/${groupId}` }, 201)
                })
            } catch (e) {
                const err = { message: 'Body must be in JSON.', code: 400 }
                setResponse(res, err, err.code, err.message)
            }
        })
    }

    /**
     * Editar grupo, alterando o seu nome e descrição
     */
    function updateGroup(req, res, next) {
        const groupId = req.parms.gId
        let body = ''

        req.on('data', data => body += data.toString())
        req.on('end', () => {
            try {
                body = JSON.parse(body)
                foca.updateGroup(groupId, body.name, body.description, err => {
                    if (!checkError(next, err))
                        setResponse(res, { '_id': groupId, '_path': `/api/groups/${groupId}` })
                })
            } catch (e) {
                const err = { message: 'Body must be in JSON.', code: 400 }
                setResponse(res, err, err.code, err.message)
            }
        })
    }

    /**
     * Remove o grupo especificado. 
     */
    function deleteGroup(req, res, next) {
        const groupId = req.parms.gId

        foca.deleteGroup(groupId, focaCallback.bind(null, res, next))
    }

    /**
     * Obter informação de um grupo 
     */
    function getGroup(req, res, next) {
        const groupId = req.parms.gId

        foca.getGroup(groupId, focaCallback.bind(null, res, next))
    }

    /**
     * Obter informação de todos os grupos 
     */
    function getGroups(_, res, next) {
        foca.getGroups(focaCallback.bind(null, res, next))
    }

    /**
     * Adicionar uma equipa a um grupo
     */
    function addTeamToGroup(req, res, next) {
        const groupId = req.parms.gId
        const teamId = req.parms.tId

        foca.addTeamToGroup(groupId, teamId, focaCallback.bind(null, res, next))
    }

    /**
     * Remover uma equipa de um grupo
     */
    function deleteTeamFromGroup(req, res, next) {
        const groupId = req.parms.gId
        const teamId = req.parms.tId

        foca.deleteTeamFromGroup(groupId, teamId, focaCallback.bind(null, res, next))
    }

    /**
     * Obter os jogos das equipas de um grupo entre duas datas. 
     */

    function getGamesOfGroup(req, res, next) {
        const groupId = req.parms.gId
        const from = req.query.from
        const to = req.query.to

        foca.getGamesOfGroup(groupId, from, to, focaCallback.bind(null, res, next))
    }

    function resourceNotFound(_, res, err) {
        if (!err)
            err = { message: 'Resource not found.', code: 404 }
        setResponse(res, err, err.code, err.message)
    }
}

function focaCallback(res, next, err, data) {
    if (!checkError(next, err))
        setResponse(res, data)
}

function checkError(next, err) {
    if (err) {
        next(err)
        return true
    }
    return false
}

function setResponse(res, body, statusCode = 200, statusMessage) {
    res.setHeader('Content-Type', 'application/json')
    res.statusCode = statusCode
    res.statusMessage = statusMessage
    res.end(body ? JSON.stringify(body) : undefined)
}