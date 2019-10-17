const express = require("express")
const router = express.Router()
const db = require('../helpers/database')
const rh = require('../helpers/router-helpers')
const bcrypt = require('bcrypt')


router.get("/", (req, res) => {
    if (!req.session.isAuthenticated) {
        res.redirect("/account/login")
    } else {
        res.redirect("/account/dashboard")
    }
})

router.get("/login", (req, res) => {
    res.render('account-login', {query:req.query})
})

router.get("/signup", (req, res) => {
    res.render('account-signup')
})

router.get("/dashboard", (req, res) => {
    if (req.session.isAuthenticated) {
        res.render("account-dashboard")
    } else {
        res.redirect("/account/login")
    }
})

router.post("/signup", (req, res) => {
    let body = req.body
    bcrypt.hash(body.password, 10, async (err, encrypted) => {
        if (err) throw err;
        await db.addUser(body.email, encrypted, body.username, body.first_name, body.last_name)
        res.redirect("/account/login")
    })
})

router.post("/login", async (req, res) => {
    let user = await db.checkForUser(req.body.email)
    let passwordCompare = new Promise((resolve, reject) => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err) throw err
                if (same) {
                    req.session.isAuthenticated = true;
                    req.session.userId = user.id
                    resolve(true)
                } else resolve(false);
            })
        } else resolve(false);
        setTimeout(() => {
            let today = new Date();
            let time = `UTC ${today.getUTCHours}:${today.getUTCMinutes}:${today.getUTCSeconds} | ${today.getFullYear}-${today.getMonth}-${today.getDate}`

            reject(`An error occurred while verifying password for user ${user.email}. \n ${time}`)
        }, 1000)
    })

    passwordCompare.then((resolve) => {
        rh.redirectIf(res, resolve, "/account", "/account/login?loginFailed=true")
    }).catch((reason) => {
        console.log(reason)
    })
})


module.exports = router