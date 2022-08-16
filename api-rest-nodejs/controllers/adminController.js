'use strict'

var Admin = require('../models/admin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const adminRegister = async function(req, res){
    //
    var data = req.body;
    var adminArray = [];

    // Check if email is already taken
    adminArray = await Admin.find({
        email: data.email
    });

    if(adminArray.length == 0){
        // check await
        // register
        if(data.password){
            bcrypt.hash(data.password, null, null, async function(err, hash){
                if(hash){
                    data.password = hash;
                    var reg = await Admin.create(data);
                    res.status(200).send({
                        message: 'User created sucessfully',
                        user: reg
                    })
                }else{
                    res.status(200).send({message: 'Error bcrypting password'})
                }
            });
        }else{
            res.status(200).send({
                message: 'There is not a pssword'
            })
        }
    }else{
        res.status(200).send({
            message: 'Email already taken. Try with another'
        })
    }
}

const adminLogin = async function(req, res){
    var data = req.body;
    var adminArray = [];

    adminArray = await Admin.find({ email: data.email });

    if(adminArray.length == 0){
        res.status(200).send({ message: 'User does not exists.' })
    }else{
        // login
        let user = adminArray[0];

        console.log(user);

        bcrypt.compare(data.password, user.password, async function(error, check){

            if(error){
                res.status(200).send({ message: 'Something went wrong.' })
            }

            if(check){
                res.status(200).send({
                    user: user,
                    token: jwt.createToken(user),
                    message: 'Login successfully.'
                });
            }else{
                res.status(200).send({ message: 'Password does not match.' })
            }
        });
    }
}

module.exports = {
    adminRegister,
    adminLogin
}