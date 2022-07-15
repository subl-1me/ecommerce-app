'use strict'

const Cart = require('../models/cart');

const add = async function(req, res){

    let params = req.body;
    delete params._id;

    try {

        var cart = await Cart.create(params);

        if(!cart) return res.status(200).send({ message: 'Error trying to add product.' });

        return res.status(200).send({ cart: cart});
    }catch(err){
        return res.status(500).send({
            status: 'error',
            message: 'Something went wrong.'
        });
    }
}

const cart = async function(req, res){
    if(!req.params['customerID']) return res.status(200).send({ message: 'CustomerID is required.' });

    var customerID = req.params['customerID'];

    try {
        
        var cartArray = {};
        var cartArray = await Cart.find({customer: customerID}).populate('customer').populate('product');

        if(cartArray.length == 0) return res.status(200).send({ messag: 'Cart is empty.' });

        return res.status(200).send({cart: cartArray})
    }catch(err){
        return res.status(500).send({ message: 'Something went wrong.' });
    }
}

const removeProduct = async function(req, res){
    if(!req.params['productCartID']) return res.status(200).send({ message: 'Cart ID is required.' });

    var productCartID = req.params['productCartID'];

    try {

        await Cart.findByIdAndDelete(productCartID);

        return res.status(200).send({ message: 'Product deleted successfully.' });

    }catch(err){
        return res.status(500).send({ message: 'Something went wrong.' });
    }
}

module.exports = {
    add,
    cart,
    removeProduct
}