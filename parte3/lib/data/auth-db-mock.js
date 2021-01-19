'use strict'

module.exports = class AuthDB {
    constructor() {
        this.users = {}
        this.counter = 0
    }

    static init() {
        return new AuthDB()
    }

    getUser(userId) {
        const user = this.users[userId]
        if (!user)
            return Promise.reject({ message: 'User not found.', statusCode: 404 })
        return Promise.resolve(user)
    }

    findUserByUsername(username) {
        return Promise.resolve(
            Object.values(this.users)
                .filter(user => user.username === username).pop()
        )
    }

    async createUser(fullname, username, password, salt) {
        let user = await this.findUserByUsername(username)
        if (user)
            throw { message: 'Username already taken.', statusCode: 409 }

        user = { '_id': this.counter++, fullname, username, password, salt }
        this.users[user._id] = user
        return user
    }

    deleteUser(userId) {
        const user = this.users[userId]
        if(!user) return Promise.reject({ message: 'User not found.', statusCode: 404 })
        delete this.users[userId]
        return Promise.resolve()
    }
}