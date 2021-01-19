'use strict'

module.exports = class FocaDB {
    static init() {
        return new FocaDB()
    }

    createGroup(userId, name, description) {
        if (!name || !description)
            return Promise.reject({ message: 'Invalid or missing parameters', statusCode: 400 })
        const id = count++
        groups[id] = {
            userId,
            'name': name,
            'description': description,
            'teams': []
        }
        return Promise.resolve(id)
    }

    getGroup(id) {
        const group = groups[id]
        if (!group)
            return Promise.reject({ message: 'Group not found', statusCode: 404 })
        return Promise.resolve(group)
    }

    updateGroup(id, group) {
        if (!groups[id])
            return Promise.reject({ message: 'Group not found', statusCode: 404 })
        groups[id] = group
        return Promise.resolve(id)
    }

    getGroups(userId) {
        const resGroups = []
        for (let i = 0; i < count; i++)
            if (groups[i] != undefined && groups[i].userId === userId)
                resGroups.push(groups[i])
        return Promise.resolve(resGroups)
    }

    deleteGroup(id) {
        const group = groups[id]
        if (!group)
            return Promise.reject({ message: 'Group not found.', statusCode: 404 })
        delete groups[id]
        return Promise.resolve(group)
    }
}

let count = 0
const groups = []
