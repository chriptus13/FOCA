'use strict'

module.exports = (app, authServices) => {
    if (!app) throw { message: 'Provide an App object' }
    
    app.post('/api/auth/signin', signIn)
    app.post('/api/auth/signup', signUp)
    app.delete('/api/auth/signout', signOut)
    app.get('/api/auth/session', getSession)

    function signIn(req, res, next) {
        authServices
            .authenticate(req.body.username, req.body.password)
            .then(userId => {
                req.login(userId, err => {
                    if (err) next(err)
                    else setResponse(res, userId)
                })
            })
            .catch(err => next(err))
    }

    function signUp(req, res, next) {
        authServices
            .createUser(req.body.fullname, req.body.username, req.body.password)
            .then(userId => {
                req.login(userId, err => {
                    if (err) next(err)
                    else setResponse(res, userId, 201)
                })
            })
            .catch(err => next(err))
    }

    function signOut(req, res, _) {
        req.logout()
        setResponse(res)
    }

    function getSession(req, res, _) {
        const username = req.isAuthenticated() ? req.user.username : undefined
        const session = {
            'auth': req.isAuthenticated(), // <=> req.user != undefined
            username
        }
        setResponse(res, session)
    }
}

function setResponse(res, body, statusCode = 200, statusMessage) {
    if (body) res.setHeader('Content-Type', 'application/json')
    res.statusCode = statusCode
    res.statusMessage = statusMessage
    res.end(body ? JSON.stringify(body) : undefined)
}