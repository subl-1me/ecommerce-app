'use strict'

// filter password
exports.safeCredentials = function(user){
    var credentials = {
        sub: user._id,
        names: user.names,
        surnames: user.surnames,
        profile: user.profile,
        phone: user.phone,
        email: user.email,
        dni: user.dni | undefined
    }

    return credentials;
}