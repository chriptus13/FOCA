'use strict'

class FocaDB {
    static init() {
        return new FocaDB()
    }

    createGroup(name, description, cb) {
        if(!name || !description)
            return cb({message: 'Invalid or missing parameters', code: 400})
        const id = count++
        groups[id] = {
            'name': name,
            'description': description,
            'teams': []
        }
        cb(null, id)
    }

    getGroup(id, cb) {
        const group = groups[id]
        if(!group) return cb({message: 'Group not found', code: 404})
        cb(null, group)
    }

    updateGroup(id, group, cb) {
        if(!groups[id]) return cb({message: 'Group not found', code: 404})
        groups[id] = group
        cb(null, id)
    }

    getGroups(cb) {
        const resGroups = []
        for(let i = 0; i <count; i++)
            if(groups[i]!=undefined)
                resGroups.push(groups[i])
        cb(null, resGroups)
    }

    deleteGroup(id, cb) {
        const group = groups[id]
        if(!group) return cb({message: 'Group not found.', code: 404})
        delete groups[id]
        cb(null, group)
    }
}

let count = 0
const groups = []

module.exports = FocaDB