'use strict'

const Product = require('../models/product');
const ProductInventory = require('../models/productInventory');

const inventories = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Product ID is required.' });

    var productID = req.params['id'];

    try {
        var inventoriesArray = {};
        var inventoriesArray = await ProductInventory.find({product: productID}).populate('admin');

        if(inventoriesArray.length == 0 ) return res.status(200).send({ message: 'No registers.' });

        return res.status(200).send({ inventories: inventoriesArray })

    }catch(err){
        return res.status(200).send({ message: 'Something went wrong.' });
    }
}

const add = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });

    var params = req.body;

    try{
        // Check if product exists
        var product = await Product.findById(params.product);
        if(!product) return res.status(200).send({ message: 'Product not found.' });

        var newInventory = await ProductInventory.create(params);

        // Set new product stock
        var newStock = parseInt(product.stock) + parseInt(params.stock);
        var updatedProduct = await Product.findByIdAndUpdate(params.product, {
            stock: newStock
        });

        if(!newInventory) return res(200).send({ message: 'Error adding register.' });

        return res.status(200).send({ newInventory: newInventory });

    }catch(err){
        return res.status(500).send({ message: 'Something went wrong.' });
    }
}

const remove = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if (!req.params['id']) return res.status(200).send({ message: 'Inventory Product ID is required.' });

    var inventoryRegisterID = req.params['id'];

    try {
        var productInventoy = await ProductInventory.findById(inventoryRegisterID);
        if(!productInventoy) return res.status(200).send({ message: 'Register not found. ' });

        
        // get Product id & update stock
        var productID = productInventoy.product; // Every inventory register have a product
        var product = await Product.findById(productID);
        var newStock = parseInt(product.stock) - parseInt(productInventoy.stock);
        var updatedProduct = await Product.findByIdAndUpdate(productID, {
            stock: newStock
        });

        // Delete register
        var removedProductInventory = await ProductInventory.findByIdAndRemove(inventoryRegisterID);

        return res.status(200).send({ message: 'Register deleted successfully. ' });
    }catch(err){
        return res.status(500).send({ message: 'Something went wrong.' });
    }

    

}

module.exports = {
    inventories,
    add,
    remove
}