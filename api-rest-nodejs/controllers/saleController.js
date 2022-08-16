const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');
const Cart = require('../models/cart');
const Product = require('../models/product');

const mailer = require('../services/mailer');
const { populate } = require('../models/saleDetail');

const registerCustomerSale = async function(req, res){

    var data = req.body;

    data.status = 'Success';
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
                stock:  product.stock - item.amount,
                sales: product.sales + 1
            })
        })

        // Delete customer cart
        await Cart.remove({customer: data.customer});

        return res.status(200).send({
            status: 'SUCCESS',
            saleRegister: newRegister
        });

    // try{

    //     data.status = 'Success';
    //     var newRegister = await Sale.create(data);
    //     if(!newRegister) return res.status(200).send({ message: 'Error trying to create register. Try again later' });

    //     // Save sale details
    //     data.details.forEach(item => {
    //         item.sale = newRegister._id;
    //     })

    //     data.details.forEach(async item => {
    //         await SaleDetail.create(item);

    //         // Update products stock
    //         var product = await Product.findById(item.product);
    //         await Product.findByIdAndUpdate(item.product, {
    //             stock:  product.stock - item.amount,
    //             sales: product.sales + 1
    //         })
    //     })

    //     // Delete customer cart
    //     await Cart.remove({customer: data.customer});

    //     return res.status(200).send({
    //         status: 'SUCCESS',
    //         saleRegister: newRegister
    //     });

    // }catch(err){
    //     return res.status(500).send({ message: 'Error trying to add sale. Try again later.' });
    // }
}

const sendSaleEmail = async function(req, res){
    if(!req.params['saleId']) return res.status(200).send({ message: 'Customer ID is required.' });

    const saleId = req.params['saleId'];
    mailer.initMailer(saleId);

    res.status(200);
}


const getSales = async function(req, res){
    if(!req.params['customerId']) return res.status(200).send({ message: 'Customer ID is required.' });
    
    try{
        const customerId = req.params['customerId'];
        var sales = await Sale.find({
            customer: customerId
        });
        if(!sales) return res.status(200).send({ message: 'Sales list is empty.' });

        return res.status(200).send({
            status: 'success',
            sales: sales
         })
    }catch(err){
        return res.status(500).send({ message: 'Something went wrong. Try again.' });
    }

}

const getSaleDetail = async function(req, res){
    if(!req.params['transaction']) return res.status(200).send({ message: 'Transaction ID is required.' });

    /*try {
        const transaction = req.params['transaction'];

        var sale = await Sale.findOne({ transaction: transaction });
        if(!sale) return res.status(200).send({ message: 'Sale does not exist.' });
        
        var saleDetail = await SaleDetail.find({ sale: sale._id }).populate('product').populate('sale')
        .populate('sale', populate('shippingAddress'));

        res.status(200).send({
            status: 'success',
            saleDetail: saleDetail
        })

    }catch(err){
        return res.status(500).send({ message: 'Something went wrong. Try again.' });
    }*/

    const transaction = req.params['transaction'];

    var sale = await Sale.findOne({ transaction: transaction });
    if(!sale) return res.status(200).send({ message: 'Sale does not exist.' });
    
    var saleDetail = await SaleDetail.find({ sale: sale._id }).populate('product').populate('sale');

    res.status(200).send({
        status: 'success',
        saleDetail: saleDetail
    })
}

module.exports = {
    registerCustomerSale,
    sendSaleEmail,
    getSales,
    getSaleDetail
}