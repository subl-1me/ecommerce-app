'use strict'

const Order = require('../models/order');
const Stripe = require('../services/stripe');

// Generate new order for stripe

const generateOrder = async function(req, res){
    if(!req.body.id) return res.status(200).send({message: 'Customer ID is required.' });
    if(!req.body.amount) return res.status(200).send({message: 'Amount ID is required.' });

    const customerID = req.body.id;
    const amount = req.body.amount;

    // Check if there is an order with waiting status
    const order = await Order.find({status: "wait"});
    if(order.length != 0){
        return res.status(200).send({ message: 'A waiting order already exists.' });
    }

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
        console.log(token);
        const responseMethod = await Stripe.generatePaymentMethod(token);
        console.log(responseMethod);

        // Generate payment intent
        const resPaymentIntent = await Stripe.generatePaymentIntent({
            amount: resOrder.amount,
            user: resOrder.customerID,
            payment_method: responseMethod.id
        })

        // Update stripeID field in order
        await Order.findByIdAndUpdate({_id: req.params['orderId']},{
            stripeId: resPaymentIntent.id
        }); 

        console.log('culo');
        console.log(resPaymentIntent);
        res.send({ data: resPaymentIntent })
    }catch(err){
        console.log(err.message);
        return res.status(500).send({ message: 'Something was wrong. Try again later.' })
    }
}

const confirmOrder = async function(req, res){
    
}

const getOrder = async function(req, res){
    console.log('ok');

    res.send('ok');
}

module.exports = {
    generateOrder,
    getOrder,
    updateOrder,
    confirmOrder
}