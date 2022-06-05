'use strict'

const Product = require('../models/product');
const Review = require('../models/review');

const add = async function(req, res){
    if(!req.params['productID']) return res.status(200).send({ message: 'Product ID is required.' });

    var params = req.body;
    var productID = req.params['productID'];

    try {

    // Check if product exists
    var product = await Product.findById(productID);
    if(!product) return res.status(400).send({ message: 'Product not found.' });

    var newReview = await Review.create(params);

    if(!newReview) return res.status(400).send({ message: 'Error trying to create review.' });

    return res.status(200).send({ message: 'Review added successfully.' })


    }catch(err){
        return res.status(500).send({ message: 'Error trying to add review. Try again.' });
    }
}

const reviews = async function(req, res){
    if(!req.params['productID']) return res.status(200).send({ message: 'Product ID is required.' });

    var reviewsArray = {};
    var productID = req.params['productID'];

    try {
        reviewsArray = await Review.find({product: productID}).populate('customer');

        return res.status(200).send({ reviews: reviewsArray})
    }catch(err){
        return res.status(500).send({ message: 'Error trying to get reviews. Try again.' })
    }
}

module.exports = {
    add,
    reviews
}