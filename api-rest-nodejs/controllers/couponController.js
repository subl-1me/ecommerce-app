'use strict'

var Coupon = require('../models/coupon');

const add = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });

    try {
        var params = req.body;

        let newCoupon = await Coupon.create(params);
        if(!newCoupon) return res.status(200).send({ message: 'Error adding coupon.' });

        return res.status(200).send({ coupon: newCoupon });
    }catch(err){
        return res.status(500).send({ message: 'Something went wrong. Try again.' });
    }
}

const coupons = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });

    try {

        var couponsArray = {};
        couponsArray = await Coupon.find();

        if(couponsArray.length == 0) return res.status(200).send({ message: 'No coupons found.' });

        return res.status(200).send({ coupons: couponsArray });


    }catch(err){
        return res.status(500).send({ message: 'Something went wrong. Try again.' });
    }
}

const remove = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Coupon ID is required.' });

    var couponID = req.params['id'];

    try{
        var removedCoupon = await Coupon.findByIdAndDelete(couponID);

        return res.status(200).send({ message: 'success' });
    }catch(err){
        return res.status(500).send({ message: 'Something went wrong. Try again.' });
    }
}

const coupon = async function(req, res){
    if(!req.params['code']) return res.status(200).send({ message: 'Coupon code is required.' });

    try {
        const couponCode = req.params['code'];

        const coupon = await Coupon.findOne({code: couponCode})
        if(!coupon) return res.status(200).send({ status: 'error', message: 'Code not found.' });

        return res.status(200).send({ coupon: coupon })
    }catch(err){
        return res.status(500).send({ message: 'Something went wrong.'})
    }
}

module.exports = {
    add,
    coupons,
    remove,
    coupon
}