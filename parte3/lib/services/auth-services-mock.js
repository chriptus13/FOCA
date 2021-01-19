'use strict'

module.exports = class AuthServices {
    constructor() {
        this.users = {}
        this.counter = 0
    }

    static init() {
        return new AuthServices()
    }

    async createUser(fullname, username, password) {
        if (!fullname || !username || !password)
            throw { message: 'Invalid or missing parameters.', statusCode: 400 }

        let user = await this.findUserByUsername(username)
        if (user)
            throw { message: 'Username already taken.', statusCode: 409 }

        user = { '_id': this.counter++, fullname, username, password }
        this.users[user._id] = user
        return user
    }

    findUserByUsername(username) {
        return Promise.resolve(
            Object.values(this.users)
                .filter(user => user.username === username).pop()
        )
    }

    getUser(userId) {
        const user = this.users[userId]
        if (!user)
            return Promise.reject({ message: 'User not found.', statusCode: 404 })
        return Promise.resolve(user)
    }

    async authenticate(username, password) {
        const user = await this.findUserByUsername(username)
        if (!user) throw { message: 'Username not found.', statusCode: 404 }
        if (password === user.password)
            return { '_id': user._id }
        else
            throw { message: 'Wrong credentials.', statusCode: 401 }
    }

    deleteUser(userId) {
        const user = this.users[userId]
        if(!user) return Promise.reject({ message: 'User not found.', statusCode: 404 })
        delete this.users[userId]
        return Promise.resolve()
    }
}