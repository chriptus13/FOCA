'use strict'

const Handlebars = require('handlebars/dist/handlebars')
const alertTemplate = require('./../views/alert.hbs')
const alertView = Handlebars.compile(alertTemplate)

module.exports = {
    showAlert,
    fetchJSON,
    ourFetch,
    validateDateInterval,
}

/**
* Show an alert to the user.
*/
function showAlert(message, type = 'danger') {
    document
        .getElementById('divAlerts')
        .insertAdjacentHTML('beforeend', alertView({ type, message })) // <=> .innerHTML += 
}

/**
* Convenience method to fetch and decode JSON.
*/
async function fetchJSON(url) {
    const resp = await ourFetch(url)
    const body = await resp.json()
    if (resp.status != 200) throw body
    return body
}

async function ourFetch(url, method = 'GET', body) {
    const opt = makeOptions(method, body)
    return fetch(url, opt)
}

function makeOptions(method, body) {
    const options = {
        'method': method,
        'credentials': 'same-origin',
        'headers': {
            'Accept-Charset': 'utf-8',
            'Content-Type': 'application/json'
        }
    }
    if (body) options.body = JSON.stringify(body)
    return options
}

function validateDateInterval(strFrom, strTo) {
    const dtFrom = new Date(strFrom).getTime()
    const dtTo = new Date(strTo).getTime()
    return dtFrom === dtFrom && dtTo === dtTo && dtTo >= dtFrom
}