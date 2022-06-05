'use strict'

const stripe = require('stripe')('sk_test_51L1yDyIX0ejDpXz2NQusVQUCrRwIQQiBlib2JuDIAchzIqGUSOlChzTx2dQAmORzqOyLcWfhLY2NGOn1aCmkCqiE005e7zcbhU');


// Generate payment intent
const generatePaymentIntent = async function({amount, customer, payment_method}){

    const paymentIntent = await stripe.paymentIntents.create({
        amount: parseFloat(amount) * 100,
        currency: 'usd',
        payment_method_types: ['card'],
        payment_method,
        description: `Prueba de pago para -> ${customer}`
    })

    return paymentIntent
}

const generatePaymentMethod = async function(token){

    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: { token },
    })

    return paymentMethod;
}

const confirmPaymentIntent = async function(id, token){
    const paymentIntent = await stripe.paymentIntents.confirm(id, { payment_method: token} );

    return paymentIntent;
}

module.exports = {
    generatePaymentIntent,
    generatePaymentMethod,
    confirmPaymentIntent
}