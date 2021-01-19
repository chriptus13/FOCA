'use strict'

const sha256 = str => require('crypto-js/sha256')(str).toString()
const util = require('./util')
const sign = require('../views/sign.html')

const URL_signIn = 'http://localhost:3000/api/auth/signin'
const URL_signUp = 'http://localhost:3000/api/auth/signup'

module.exports = (divMain, session, updateNav) => {
    if (session.auth) {
        window.location.hash = '#focaIndex'
        return
    }

    divMain.innerHTML = sign

    const signInTxts = {
        'username': document.getElementById('inputUsernameSI'),
        'password': document.getElementById('inputPasswordSI')
    }
    const signUpTxts = {
        'fullname': document.getElementById('inputFullnameSU'),
        'username': document.getElementById('inputUsernameSU'),
        'password': document.getElementById('inputPasswordSU'),
        'confirmPassword': document.getElementById('inputConfirmPasswordSU')
    }

    document
        .getElementById('buttonSignIn')
        .addEventListener('click', signInHandler)
    document
        .getElementById('buttonSignUp')
        .addEventListener('click', signUpHandler)

    function signInHandler(ev) {
        ev.preventDefault()
        const username = signInTxts.username.value.toLowerCase()
        const password = signInTxts.password.value
        if (username === '') util.showAlert('Insert username!')
        else if (password === '') util.showAlert('Insert password!')
        else {
            const user = {
                username,
                'password': sha256(password)
            }
            util.ourFetch(URL_signIn, 'POST', user)
                .then(resp => {
                    if (resp.status == 200) updateNav().then(() => window.location.hash = '#focaIndex')
                    else {
                        resp.json()
                            .then(body => util.showAlert(`${resp.status} ${resp.statusText}: ${JSON.stringify(body)}`))
                    }
                })
                .catch(err => util.showAlert(JSON.stringify(err)))
        }
    }

    function signUpHandler(ev) {
        ev.preventDefault()
        const fullname = signUpTxts.fullname.value
        const username = signUpTxts.username.value.toLowerCase()
        const password = signUpTxts.password.value
        const confirmPassword = signUpTxts.confirmPassword.value

        if (fullname === '') util.showAlert('Insert fullname!')
        else if (username === '') util.showAlert('Insert username!')
        else if (password === '') util.showAlert('Insert password!')
        else if (confirmPassword === '') util.showAlert('Confirm password!')
        else if (password !== confirmPassword) util.showAlert("Passwords don't match!")
        else {
            const user = {
                fullname,
                username,
                'password': sha256(password)
            }
            util.ourFetch(URL_signUp, 'POST', user)
                .then(resp => {
                    if (resp.status == 201)
                        updateNav()
                            .then(() => window.location.hash = '#focaIndex')
                    else
                        resp.json()
                            .then(body => util.showAlert(`${resp.status} ${resp.statusText}: ${JSON.stringify(body)}`))
                })
                .catch(err => util.showAlert(JSON.stringify(err)))
        }
    }
}