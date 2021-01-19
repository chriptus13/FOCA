'use strict'

const sha256 = str => require('crypto-js/sha256')(str).toString()
const { Entropy } = require('entropy-string')
const entropy = new Entropy()

module.exports = class AuthServices {
    constructor(authDB) {
        this.authDB = authDB
    }

    /**
     * Initializes and returns an instance of AuthServices based on 
     * the given AuthDB instance
     * @param {Object} authDB - AuthDB instance 
     * @returns {Object} AuthServices instance
     */
    static init(authDB) {
        return new AuthServices(authDB)
    }

    createUser(fullname, username, password) {
        if (!fullname || !username || !password)
            return Promise.reject({ message: 'Invalid or missing parameters.', statusCode: 400 })
        const salt = entropy.string()
        const hashpwd = sha256(password + salt)
        return this.authDB.createUser(fullname, username, hashpwd, salt)
    }

    getUser(userId) {
        return this.authDB.getUser(userId)
    }

    async authenticate(username, password) {
        const user = await this.authDB.findUserByUsername(username)
        if (!user) throw { message: 'Username not found.', statusCode: 404 }
        const salt = user.salt
        const hashpwd = sha256(password + salt)
        if (hashpwd === user.password)
            return { '_id': user._id }
        else
            throw { message: 'Wrong credentials.', statusCode: 401 }
    }

    deleteUser(userId) {
        return this.authDB.deleteUser(userId)
    }
}