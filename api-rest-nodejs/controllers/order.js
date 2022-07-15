'use strict'

const Order = require('../models/order');
const Stripe = require('../services/stripe');

// Generate new order for stripe

const generateOrder = async function(req, res){
    if(!req.body.id) return res.status(200).send({message: 'Customer ID is required.' });
    if(!req.body.amount) return res.status(200).send({message: 'Amount is required.' });

    const customerID = req.body.id;
    const amount = req.body.amount;

    // Check if there is an order with waiting status
    const order = await Order.find({status: "wait"});
    if(order.length != 0) return res.status(200).send({ message: 'A waiting order already exists.' });

    try {
        const orderRes = await Order.create({
            customerID: customerID,
            amount: amount
        });

        res.send({ data: orderRes })
    }catch(e) {
        res.status(500);
        res.send({ error: 'Something went wrong.' });
    }
}

const updateOrder = async function(req, res){
    if(!req.params['orderId']) return res.status(200).send({ message: 'An order ID is required.' });
    //if(!req.body) return res.status(200).send({ message: 'An order ID is required.' });

    try{
        // Search actual order
        const resOrder = await Order.findOne({_id: req.params['orderId']});
            
        // Generate payment method
        const token = req.body.token;
        
        const responseMethod = await Stripe.generatePaymentMethod(token);  
            
        // Generate payment intents
        const resPaymentIntent = await Stripe.generatePaymentIntent({
            amount: resOrder.amount,
            user: resOrder.customerID,
            payment_method: responseMethod.id
        })
            
        console.log(resPaymentIntent);
        console.log('ok2');
        // Update stripeID field in order
        await Order.findByIdAndUpdate({_id: req.params['orderId']},{
            stripeId: resPaymentIntent.id
        }); 
            
        console.log('culo el que lo lea');
        console.log(resPaymentIntent);
        res.send({ data: resPaymentIntent })
    }catch(err){
        console.log(err.message);
        return res.status(500).send({ message: 'Something was wrong. Try again later.' })
    }

}


const getOrders = async function(_req, res){
    
    try{
        var orders = await Order.find();
        if(!orders) return res.status(200).send({ message: 'Orders list is empty.' });

        return res.status(200).send({
            status: 'success',
            orders: orders
         })
    }catch(err){
        return res.status(500).send({ message: 'Something went wrong. Try again.' });
    }
}

const confirmOrder = async function(req, res){
    if(!req.params['orderId']) return res.status(200).send({ message: 'Order ID is requried.' });

    const Orderid = req.params['orderId'];

    try{
        await Order.findByIdAndDelete(Orderid);

        return res.status(200).send({
            status: 200,
            message: 'Order completed successfully.'
        })
    }catch(err){
        return res.status(500).send({
            status: 500,
            message: 'Something went wrong trying to update order. Try again.' 
        })
    }
}

const getOrder = async function(req, res){

}

module.exports = {
    generateOrder,
    getOrders,
    updateOrder,
    confirmOrder
}