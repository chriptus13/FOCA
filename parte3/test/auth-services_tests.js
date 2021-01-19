'use strict'

const assert = require('assert')
const sha256 = str => require('crypto-js/sha256')(str).toString()


// auth-db-mock
/**/
const authDB = require('../lib/data/auth-db-mock').init()
const auth = require('../lib/services/auth-services').init(authDB)
/**/

// auth-services-mock
/*
const auth = require('../lib/services/auth-services-mock').init()
*/

/*
// real auth-db
const es = {
    host: 'localhost',
    port: 9200,
    auth_index: 'users/user'
}
const authDB = require('../lib/data/auth-db').init(es)
const auth = require('../lib/services/auth-services').init(authDB)
*/

describe('Auth Services Test', () => {
    it('Should create user', async () => {
        try {
            const user = await auth.createUser('fullname', 'user1', 'password')
            assert.equal(user.fullname, 'fullname')
            assert.equal(user.username, 'user1')
            await auth.deleteUser(user._id)
        } catch(err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should get user', async () => {
        try {
            const userInserted = await auth.createUser('fullname', 'user2', 'password')
            const user = await auth.getUser(userInserted._id)
            assert.equal(user.fullname, userInserted.fullname)
            assert.equal(user.username, userInserted.username)
            await auth.deleteUser(user._id)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying to get unexistent user', async () => {
        try {
            await auth.getUser('invalidUsername')
        } catch (err) {
            assert.equal(err.statusCode, 404)
            return
        }
        assert.fail('Supposed to fail with error 404')
    })

    it('Should fail trying to create user with already taken username', async () => {
        let user
        try {
            user = await auth.createUser('fullname', 'user3', 'password1')
            await auth.createUser('fullname2', 'user3', 'password2')
            await auth.deleteUser(user._id)
            assert.fail('Supposed to fail with error 409')
        } catch (err) {
            assert.equal(err.statusCode, 409)
        }
        await auth.deleteUser(user._id)
    })

    it('Should authenticate user', async () => {
        try {
            const pwd = 'password'
            const user = await auth.createUser('fullname', 'user4', pwd)
            const id = await auth.authenticate(user.username, pwd)
            assert.equal(id._id, user._id)
            await auth.deleteUser(user._id)
        } catch (err) {
            assert.fail('Not supposed to fail')
        }
    })

    it('Should fail trying to authenticate unexistent user', async () => {
        try {
            await auth.authenticate('invalidUser', 'password')
        } catch (err) {
            assert.equal(err.statusCode, 404)
            return
        }
        assert.fail('Supposed to fail with error 404')
    })

    it('Should fail trying to authenticate invalid password', async () => {
        let user
        try {
            user = await auth.createUser('fullname', 'user1', 'password1')
            await auth.authenticate(user.username, 'wrongPassword')
            await auth.deleteUser(user._id)
            assert.fail('Supposed to fail with error 401')
        } catch (err) {
            assert.equal(err.statusCode, 401)
            await auth.deleteUser(user._id)
        }
    })
})
