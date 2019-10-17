const pgp = require("pg-promise")()
const pgpDb = pgp("postgres://localhost:5432/express_anime_app")

function checkForUser(email) {
    return pgpDb.oneOrNone('SELECT email, password FROM users WHERE email = $1', [email.toLowerCase()])
}

function addUser(email, password, username, firstName, lastName) {
    return pgpDb.none(("INSERT INTO users (email, password, username, first_name, last_name) VALUES " + 
    "($1, $2, $3, $4, $5);"), [email.toLowerCase(), password, username, firstName, lastName] )
}
"hello".to


module.exports = {
    checkForUser:checkForUser,
    addUser:addUser
}