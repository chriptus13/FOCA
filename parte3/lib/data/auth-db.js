'use strict'

const rp = require('request-promise')

module.exports = class AuthDB {
    constructor(es) {
        this.host = es.host;
        this.port = es.port;
        this.auth_index = es.auth_index
        this.url = `http://${es.host}:${es.port}/${es.auth_index}`
        this.refreshUrl = `http://${es.host}:${es.port}/${es.auth_index.split('/')[0]}/_refresh`
    }

    /**
     * Initializes and returns an instance of AuthDB for operations on the given ElasticSearch DB
     * @param {Object} es - Object with information about the ElasticSearch configuration
     * @param {String} es.host - Hostname
     * @param {Number} es.port - Port number
     * @param {String} es.auth_index - Index in the ElasticSearch DB
     * @returns {Object} AuthDB instance 
     */
    static init(es) {
        return new AuthDB(es)
    }

    getUser(userId) {
        const uri = makeUri(`${this.url}/${userId}`)
        return rp.get(uri)
            .catch(err =>
                Promise.reject(err.statusCode == 404 ?
                    { message: 'User not found.', statusCode: 404 }
                    :
                    { message: 'Auth DB inaccessible.', statusCode: 503 }
                )
            )
            .then(parseUser)
    }

    findUserByUsername(username) {
        const uri = makeUri(`${this.url}/_search?q=username:${username}`)
        return rp.get(uri)
            .catch(() => Promise.reject({ message: 'Auth DB inaccessible.', statusCode: 503 }))
            .then(data => data.hits.hits.map(parseUser).pop())
    }

    async createUser(fullname, username, password, salt) {
        let user = await this.findUserByUsername(username)
        if (user) throw { message: 'Username already taken.', statusCode: 409 }

        user = { fullname, username, password, salt }
        const uri = makeUri(this.url, user)
        try {
            const data = await rp.post(uri)
            await rp.post(this.refreshUrl)
            return { '_id': data._id }
        } catch (err) {
            throw { message: 'Auth DB inaccessible.', statusCode: 503 }
        }
    }

    deleteUser(userId) {
        const uri = makeUri(`${this.url}/${userId}`)
        return rp.delete(uri)
            .catch(() => Promise.reject({ message: 'Auth DB inaccessible.', statusCode: 503 }))
    }
}

const parseUser = (data) => ({
    '_id': data._id,
    'fullname': data._source.fullname,
    'username': data._source.username,
    'password': data._source.password,
    'salt': data._source.salt
})

function makeUri(uri, body) {
    const obj = {
        'uri': uri,
        'json': true,
        'headers': {
            'Accept-Charset': 'utf-8'
        }
    }
    if (body) obj.body = body
    return obj
}