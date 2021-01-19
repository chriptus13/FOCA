'use strict'

const rp = require('request-promise')

module.exports = class FocaDB {
    constructor(es) {
        this.host = es.host;
        this.port = es.port;
        this.groups_index = es.groups_index
        this.url = `http://${es.host}:${es.port}/${es.groups_index}`
    }

    /**
     * Initializes and returns an instance of FocaDB for operations on the given ElasticSearch DB
     * @param {Object} es - Object with information about the ElasticSearch configuration
     * @param {String} es.host - Hostname
     * @param {Number} es.port - Port number
     * @param {String} es.groups_index - Index in the ElasticSearch DB
     * @returns {Object} FocaDB instance 
     */
    static init(es) {
        return new FocaDB(es)
    }

    /**
     * Creates a new group with the given name and description and obtains its id
     * @param {String} name - Name for the new group 
     * @param {String} description - Description for the new group
     * @returns {Promise} Promise representing the id of the newly created group
     */
    createGroup(name, description) {
        const group = {
            'name': name,
            'description': description,
            'teams': []
        }
        const uri = makeUri(this.url, group)
        return rp.post(uri)
            .catch(() => Promise.reject({ message: 'FOCA DB inaccessible.', statusCode: 503 }))
            .then(data => data._id)
    }

    /**
     * Updates a group based on the given id
     * @param {String} id - Group id
     * @param {Object} group - New group to update
     * @returns {Promise} Promise representing the successfulness
     */
    updateGroup(id, group) {
        const uri = makeUri(`${this.url}/${id}`, group)
        return rp.put(uri)
            .catch(() => Promise.reject({ message: 'FOCA DB inaccessible.', statusCode: 503 }))
    }

    /**
     * Obtains an array with all the groups in the DB
     * @returns {Promise} Promise representing an array of groups
     */
    getGroups() {
        const uri = makeUri(`${this.url}/_search`)
        return rp.get(uri)
            .catch(() => Promise.reject({ message: 'FOCA DB inaccessible.', statusCode: 503 }))
            .then(data => data.hits.hits.map(grp => grp._source))
    }

    /**
     * Obtains the group with the given id
     * @param {String} id  - Group id
     * @returns {Promise} Promise representing the group with the given id
     */
    getGroup(id) {
        const uri = makeUri(`${this.url}/${id}`)
        return rp.get(uri)
            .catch(err =>
                Promise.reject(err.statusCode == 404 ?
                    { message: 'Group not found.', statusCode: 404 }
                    :
                    { message: 'FOCA DB inaccessible.', statusCode: 503 }
                )
            )
            .then(data => data._source)
    }

    /**
     * Deletes a group based on the given id
     * @param {String} id - Group id
     * @returns {Promise} Promise representing the successfulness 
     */
    deleteGroup(id) {
        const uri = makeUri(`${this.url}/${id}`)
        return rp.delete(uri)
            .catch(err =>
                Promise.reject(err.statusCode == 404 ?
                    { message: 'Group not found.', statusCode: 404 }
                    :
                    { message: 'FOCA DB inaccessible.', statusCode: 503 }
                )
            )
    }
}

/**
 * Create and returns the 'options' object for requests
 * @param {String} uri - URI for request
 * @param {Object} [body] - The request body
 * @returns {Object} Object with the options for the request 
 */
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