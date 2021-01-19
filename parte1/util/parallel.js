'use strict'

module.exports = function parallel(tasks, cb) {
    let resArr = []
    let count = 0
    tasks.forEach((elem, idx) => {
        elem((err, data) => {
            if (err) return cb(err)
            resArr[idx] = data
            if (++count == tasks.length) return cb(null, resArr)
        })
    });
}