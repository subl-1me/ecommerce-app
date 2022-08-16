'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
const secret = 'hi-iwanttobeadeveloper';

exports.auth = function(req, res, next){


    if(!req.headers.authorization) return res.status(403).send({ message: 'Token not found.' });

    var token = req.headers.authorization.replace(/['"]+/g,'');
    var segment = token.split('.');

    // invalid token cases
    if(segment.length != 3) return res.status(403).send({ message: 'Invalid token.' });

    try {
        var payload = jwt.decode(token, secret);

        if(payload.exp < moment().unix) return res.status(402).send({ message: 'Token expired.' });   
    } catch(err){
        return res.status(400).send({ message: 'Something went wrong validating token. Try again' });
    }

    req.user = payload;
    next();
}