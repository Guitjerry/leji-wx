var staticVariables = (function () {
    var currentUser = null

    return {
        setUser: function (user) {
            currentUser = user
        },
        getUser: function () {
            return currentUser
        }
    }
} ())

module.exports = {
    statics: staticVariables
}
