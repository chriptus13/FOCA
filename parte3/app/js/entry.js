'use strict'

require('./../../node_modules/bootstrap/dist/css/bootstrap.css')
require('./../../node_modules/bootstrap/dist/js/bootstrap.js')
const Handlebars = require('handlebars/dist/handlebars')

const util = require('./util')
const focaIndex = require('./focaIndex')
const leagues = require('./leagues')
const sign = require('./sign')

const mainView = require('./../views/main.html')
const navbarView = Handlebars.compile(require('./../views/navbar.hbs'))

document.body.innerHTML = mainView
const divMain = document.getElementById('divMain')
const divNavbar = document.getElementById('divNavbar')

window.onload = () => showNavbar().then(showView)
window.onhashchange = showView

async function showView() { // caso o switch cresca e tenha mais subpaginas deveremos implementar uma especie de "router"
    const path = window.location.hash
    divMain.innerHTML = ''
    switch (path) {
        case '#focaIndex':
            focaIndex(divMain, await getSession())
            break
        case '#leagues':
            leagues(divMain)
            break
        case '#sign':
            sign(divMain, await getSession(), showNavbar)
            break
        default:
            divMain.innerHTML = 'Resource Not Found!'
    }
    updateNav(path)
}

async function showNavbar() {
    const session = await getSession() // body => {auth, username}
    divNavbar.innerHTML = navbarView(session)
    if (session.auth)
        document
            .getElementById('nav#signOut')
            .addEventListener('click', logout)
}

async function getSession() {
    const resp = await fetch('/api/auth/session')
    const session = await resp.json()
    if (resp.status != 200) {
        util.showAlert(JSON.stringify(session))
        return { auth: false }
    }
    return session
}

function updateNav(path) {
    const current = document.querySelector('a.active')
    if (current) current.classList.remove('active')
    const nav = document.getElementById('nav' + path)
    if (nav) nav.classList.add('active')
}

function logout(ev) {
    ev.preventDefault()
    util.ourFetch('http://localhost:3000/api/auth/signout', 'DELETE')
        .then(showNavbar)
        .then(() => {
            window.location.hash = '#focaIndex'
            showView()
        })
}