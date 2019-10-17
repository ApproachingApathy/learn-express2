function redirectIf(res, bool, successAddress, failureAddress) {
    if (bool) {
        res.redirect(successAddress)
    } else {
        res.redirect(failureAddress)
    }
}

module.exports = {
    redirectIf:redirectIf
}