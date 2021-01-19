'use strict'
const url = require('url')

const ERROR = {
    code: 404,
    message: 'Resource not found.'
}

class Router {
    constructor() {
        this.routes = {
            'GET': [],
            'POST': [],
            'DELETE': [],
            'PUT': []
        }
        this.errorHd = (_, res) => { res.end() }
    }

    static init() {
        return new Router()
    }

    get(path, handler) {
        use.call(this, 'GET', path, handler)
    }

    post(path, handler) {
        use.call(this, 'POST', path, handler)
    }

    put(path, handler) {
        use.call(this, 'PUT', path, handler)
    }

    delete(path, handler) {
        use.call(this, 'DELETE', path, handler)
    }

    errorHandler(handler) {
        this.errorHd = handler
    }

    find(req, res) {
        const method = req.method
        const { pathname, query } = url.parse(req.url, true)

        const rt = this.routes[method].find(route => comparePathnames(route.path, pathname, route.containsVars))

        req.pathname = pathname
        req.query = query

        if (rt) {
            addPathParms(req, rt.path, pathname, rt.containsVars)
            return rt.handler(req, res, err => {
                if (err) this.errorHd(req, res, err)
            })
        }
        this.errorHd(req, res, ERROR)
    }
}

module.exports = Router

/**
 * 
 * @param {String} method - request method
 * @param {String} pathname - Pathname w/wo variables prefixed by `:`
 * @param {Function} hd - Handler to handle the request for this route -- Function(Request, Response, errorCb)
 */
function use(method, pathname, hd) {
    const parts = pathname.split('/')
    const containsVars = parts.some(str => str.indexOf(':') == 0)

    const route = {
        'path': pathname,
        'containsVars': containsVars,
        'handler': hd
    }
    this.routes[method].push(route)
}

/**
 * 
 * @param {String} pathname - original pathname with path variables names
 * @param {String} path - current path
 * @param {boolean} containsVars - indicates if the route contains path variables
 */
function comparePathnames(pathname, path, containsVars) {
    if (containsVars) {
        const parts = pathname.split('/')
        const pathParts = path.split('/')
        return parts.length == pathParts.length && parts.every((curr, i) => curr.indexOf(':') == 0 || curr === pathParts[i])
    }
    return path === pathname
}

/**
 * 
 * @param {Request} req - request to add path parameters in case this route contains variables
 * @param {String} pathname - original pathname with path variables names
 * @param {String} path - current path to extract the variable values from
 * @param {boolean} containsVars - indicates if the route contains path variables
 */
function addPathParms(req, pathname, path, containsVars) {
    if (containsVars) {
        const parts = pathname.split('/')
        const pathParms = {}
        const pathParts = path.split('/')
        parts.forEach((curr, i) => {
            if (curr.indexOf(':') == 0)
                pathParms[curr.substring(1)] = pathParts[i]
        })
        req.parms = pathParms
    }
}