const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');
const Cart = require('../models/cart');
const Product = require('../models/product');

const mailer = require('../services/mailer');

const registerCustomerSale = async function(req, res){

    var data = req.body;

    try{

        data.status = 'PROCESSING';
        var newRegister = await Sale.create(data);
        if(!newRegister) return res.status(200).send({ message: 'Error trying to create register. Try again later' });

        // Save sale details
        data.details.forEach(item => {
            item.sale = newRegister._id;
        })

        data.details.forEach(async item => {
            await SaleDetail.create(item);

            // Update products stock
            var product = await Product.findById(item.product);
            await Product.findByIdAndUpdate(item.product, {
                stock:  product.stock - item.amount
            })
        })

        // Delete customer cart
        await Cart.remove({customer: data.customer});

        return res.status(200).send({
            status: 'SUCCESS',
            saleRegister: newRegister
        });

    }catch(err){
        return res.status(500).send({ message: 'Error trying to add sale. Try again later.' });
    }
}

const sendSaleEmail = async function(req, res){
    if(!req.params['saleId']) return res.status(200).send({ message: 'Customer ID is required.' });

    const saleId = req.params['saleId'];
    mailer.initMailer(saleId);

    res.status(200);
}

module.exports = {
    registerCustomerSale,
    sendSaleEmail,
}