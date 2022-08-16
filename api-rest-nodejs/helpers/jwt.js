'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

var key = 'hi-iwanttobeadeveloper';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        names: user.names,
        surnames: user.surnames,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    }

    return jwt.encode(payload, key);
}


