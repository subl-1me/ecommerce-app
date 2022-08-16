'use strict'

const Wishlist = require('../models/wishlist');
const Product = require('../models/product');

const add = async function(req, res){
    if(!req.body.customer) return res.status(200).send({ message: 'Customer ID is required.' });

    const product = await Product.findById(req.body.product);
    if(!product) return res.status(200).send({ message: 'Product does not exists in database.' })

    try {
        const data = req.body;
        var wishlist = await Wishlist.findOneAndUpdate(
            { customer: data.customer },
            { $push: { products: data.product } }
        );

        return res.status(200).send({
            status: 200,
            message: 'Product added successfully' 
        })
    }catch(err){
        return res.status(500).send({
            status: 500,
            message: 'Error trying to add products to your wishlist.'
        });
    }
}

const remove = async function(req, res){
    if(!req.params['product']) return res.status(200).send({ message: 'Product ID is required.' });
    if(!req.params['customer']) return res.status(200).send({ message: 'Customer ID is required.' });

    //Search customer's wishlist
    try{
        
        const customerId = req.params['customer'];
        const productId = req.params['product'];
        var wishlist = await Wishlist.findOneAndUpdate(
            { customer: customerId },
            { $pull: { products: productId } }    
        );

        return res.status(200).send({
            status: 200,
            message: 'Wishlist updated successfully.'
        })
    }catch(err){
        return res.status(500).send({
            status: 500,
            message: 'Error trying to update your wishlist.'
        })
    }
}

const items = async function(req, res){
    if(!req.params['customer']) return res.status(200).send({ message: 'Customer ID is required.' });

    try{

        const customerId = req.params['customer'];

        const wishlist = await Wishlist.findOne({ customer: customerId }).populate('products');
        if(!wishlist) return res.status(200).send({ 
            status: 200,
            message: 'Wishlist empty.' 
        })
    
        const items = wishlist.products;
    
        return res.status(200).send({
            status: 200,
            items: items
        })

    }catch(err){
        return res.status(200).send({ message: 'Error trying to get items.' });
    }
}



module.exports = {
    add,
    remove,
    items
}