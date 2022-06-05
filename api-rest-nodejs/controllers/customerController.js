'use strict'

var Customer = require('../models/customer');
var Direction = require('../models/direction');

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
var credentials = require('../helpers/safeCredentials');
var generator = require('../helpers/passwordGenerator');

const register = async function(req, res){
    //
    var data = req.body;
    var customerArray = [];

    // Check if email is already taken
    customerArray = await Customer.find({
        email: data.email
    });

    if(customerArray.length == 0){
        // check await
        // register
        if(data.password){
            bcrypt.hash(data.password, null, null, async function(err, hash){
                if(hash){
                    data.password = hash;
                    var reg = await Customer.create(data);
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
                message: 'There is not a password'
            })
        }
    }else{
        res.status(200).send({
            message: 'Email already taken. Try with another'
        })
    }
}

const login = async function(req, res){
    var data = req.body;
    var customerArray = [];

    customerArray = await Customer.find({ email: data.email});

    if(customerArray.length == 0){
        res.status(200).send({ message: 'User doesnt exists.' })
    }else{
        // login
        let customer = customerArray[0];    

        bcrypt.compare(data.password, customer.password, async function(error, check){
            if(check){
                res.status(200).send({
                    customer: customer,
                    token: jwt.createToken(customer),
                    message: 'Login successfully.'
                });
            }else{
                res.status(200).send({ message: 'Password doesnt match.' })
            }
        });
    }
}

// get customers list
const list = async function(req, res){

    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });

    const filterBy = req.query.filterBy;
    var content = req.query.content; // content that user send to search
    
    var customersArray = [];

    // no filters
    if(filterBy == undefined && content == undefined){
        customersArray = await Customer.find();

        var safeArray = [];
        
        //safe user
        customersArray.forEach(cust => {
            safeArray.push(credentials.safeCredentials(cust));
        });

        res.status(200).send({
            status: 'success',
            customers: safeArray 
        });
    }

    content = new RegExp(content, 'i');

    if(filterBy == 'email'){
        customersArray = await Customer.find({ email: content });
        var safeArray = [];
        
        //safe user
        customersArray.forEach(cust => {
            safeArray.push(credentials.safeCredentials(cust));
        });

        if(customersArray.length == 0){
            res.status(200).send({
                message: 'user does not exists',
                status: 'error'
            })
        }else{
            res.status(200).send({
                filter: 'email',
                customers: safeArray
            })
        }
    }

}

const listById = async function(req, res){
    if(!req.params['id']) return res.status(200).send({ message: 'An user ID is required.' });

    var id = req.params['id'];

    //await new Promise(resolve => setTimeout(resolve, 3000));

    try{
        var user = await Customer.findById({_id: id});

        res.status(200).send({
            status: 'success',
            customer: user
        })
    }catch(err){
        res.status(200).send({
            status: 'error',
            message: 'User does not exists.'
        });
    }
}

// register manually a customer
const create = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });

    // Generate random password for users registered manually
    var randomPassword = generator.generate();
    var data = req.body;
    data.password = randomPassword;

    var reg = await Customer.create(data);

    return res.status(200).send({ 
        message: 'success',
        customer: reg
    });
}

const edit = async function(req, res){
    if(!req.params['id']) return res.status(200).send({ message: 'An user ID is required.' });

    var id = req.params['id'];
    var params = req.body;

    try {
        var updatedCustomer = await Customer.findByIdAndUpdate(id, {
            names: params.names,
            surnames: params.surnames,
            email: params.email,
            gender: params.gender,
            dni: params.dni,
            birthday: params.birthday,
            country: params.country,
            phone: params.phone,
            city: params.city,
        }); 

        return res.status(200).send({
            status: 'success',
            updatedCustomer: updatedCustomer
        });

    } catch(err){
        return res.status(200).send({
            status: 'error',
            message: 'User not found'
        })
    }

}

const remove = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'An user ID is required.' });

    var id = req.params['id'];

    try {
        await Customer.findByIdAndDelete({_id: id});

        return res.status(200).send({
            status: 'success'
        });
    }catch(err){
        return res.status(400).send({
            status: 'error',
            message: 'User does not exists.'
        });
    }
}







module.exports = {
    register,
    login,
    list,
    listById,
    create,
    edit,
    remove
}