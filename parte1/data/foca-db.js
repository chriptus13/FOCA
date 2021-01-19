'use strict'
const request = require('request')

module.exports = class FocaDB {
    static init(es) {
        return new FocaDB(es)
    }

    constructor(es) {
        this.host = es.host;
        this.port = es.port;
        this.groups_index = es.groups_index
        this.url = `http://${es.host}:${es.port}/${es.groups_index}`
    }

    createGroup(name, description, cb) {
        const group = {
            'name': name,
            'description': description,
            'teams': []
        }
        const uri = makeUri(this.url, group)
        request.post(uri, (err, _, data) => {
            if (err) return cb({ message: 'FOCA DB inaccessible.', code: 503 })
            cb(null, data._id)
        })
    }

    updateGroup(id, group, cb) {
        const uri = makeUri(`${this.url}/${id}`, group)
        request.put(uri, err => {
            if (err) return cb({ message: 'FOCA DB inaccessible.', code: 503 })
            cb(null)
        })
    }

    getGroups(cb) {
        const uri = makeUri(`${this.url}/_search`)
        request.get(uri, (err, _, data) => {
            if (err) return cb({ message: 'FOCA DB inaccessible.', code: 503 })
            cb(null, data.hits.hits.map(grp => grp._source))
        })
    }

    getGroup(id, cb) {
        const uri = makeUri(`${this.url}/${id}`)
        request.get(uri, (err, res, data) => {
            if (!checkError(cb, err, res))
                cb(null, data._source)
        })
    }

    deleteGroup(id, cb) {
        const uri = makeUri(`${this.url}/${id}`)
        request.delete(uri, (err, res) => {
            if (!checkError(cb, err, res))
                cb(null)
        })
    }
}

function checkError(cb, err, res) {
    if (err) {
        cb({ message: 'FOCA DB inaccessible.', code: 503 })
        return true
    } else if (res.statusCode == 404) {
        cb({ message: 'Group not found.', code: 404 })
        return true
    }
    return false
}

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