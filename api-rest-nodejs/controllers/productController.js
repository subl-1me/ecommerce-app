'use strict'

const Product = require('../models/product');
const ProductInventory = require('../models/productInventory');

const path = require('path');
const _fileService = require('../services/files.service');
const uniqid = require('uniqid');

const multer = require('multer');
const { db } = require('../models/product');
const directoryPath = path.join(__dirname, '../uploads/products/');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/products');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage : storage }).single('image');

const add = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });

    try{
        var params = req.body;
        var productName = req.body.title.toLowerCase();
        var slug = productName;
    
        var newProduct = await Product.create(params);
        newProduct.slug = slug;
    
        // Register Initial Inventory
        var inventoryData = {
            product: newProduct._id,
            stock: params.stock,
            admin: req.user.sub
        }

        var newProductInventory = await ProductInventory.create(inventoryData);
    
        return res.status(200).send({
            status: 'success',
            product: newProduct,
            productInventory: newProductInventory
        });
    }catch(err){
        return res.status(200).send({ message: 'Something went wrong adding product.' });
    }
}

const remove = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Product ID required.' });

    var productID = req.params['id'];

    // Get cover image URL
    try{
        var product = await Product.findById(productID);
    }catch(err){
        return res.status(200).send({ message: 'Product not found.' });
    }

    var coverImageURLSplited = product.coverImage.split('/');
    var fileName = coverImageURLSplited[3];

    // Delete cover image
    try{
        _fileService.deleteFile(directoryPath, fileName);
    }catch(err){
        return res.status(500).send(err);
    }

    await Product.findByIdAndDelete(productID);
    return res.status(200).send({ message: 'Product deleted successfully.' });
}

const products = async function(req, res){
    
    var filter = req.params['title'];
    var productsArray = {};

    // if there is a filter param
    if(filter){
        const title = new RegExp(filter, 'i');
        productsArray = await Product.find({ title: title});

        if(productsArray.length == 0) return res.status(200).send({ message: 'Product not found. '});

        return res.status(200).send({
            status: 'success',
            products: productsArray
        });
    }

    productsArray = await Product.find();

    if(productsArray.length == 0) return res.status(200).send({ message: 'Product not found.' });

    return res.status(200).send({
        status: 'success',
        products: productsArray
    })
}

const productsByCategory = async function(req, res){

    var filter = new RegExp(req.params['category'], 'i');
    var productsArray = {};

    try {
        productsArray = await Product.find({category: filter});

        return res.status(200).send({ products: productsArray})
    }catch(err){
        return res.status(500).send({ message: 'Error.' });
    }
}

const edit = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Product ID is required.' });

    var id = req.params['id'];
    var params = req.body;

    try {

        var productName = req.body.title.toLowerCase();
        var slug = productName.replace(/\s/g, '-');

        var updatedProduct = await Product.findByIdAndUpdate(id, {
            title: params.title,
            slug: slug,
            description: params.description,
            content: params.description,
            coverImage: params.coverImage,
            stock: params.stock,
            price: params.price,
            category: params.category,
            category: params.category,
            updatedAt: Date.now()
        });

        return res.status(200).send({
            updatedProduct: updatedProduct
        })

    } catch(err){
        return res.status(200).send({ message: 'Something went wront updating product. Try again.' });
    }
}

const uploadCoverImage = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/products');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    
    const upload = multer({ storage : storage }).single('image');

    upload(req, res, (err) => {
        if(err) return res.status(500).send({ message: 'Error trying to upload image.' })

        return res.status(200).send({ path: 'http://localhost:4201/' + req.file.filename })
    });
}

const uploadGalleryImages = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Product ID is required.' });

    var productID = req.params['id'];

    try {
        _fileService.createDirectory(directoryPath, productID);
    }catch(err){
        return res.status(500).send({ message: err });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads/products/'+ 'gallery-' + productID);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });

    const upload = multer({ storage: storage }).array('images', 5);

    upload(req, res, (err) => {
        if(err) return res.status(500).send({ message: 'Error trying to upload image.' });

        var pathArray = []
        req.files.forEach(file => {
            pathArray.push('http://localhost:4201/' + 'gallery-' + productID + '/' + file.filename);
        })
        return res.status(200).send({ multipleImages: pathArray });
    })
}

const setGalleryImages = async function(req, res){
    if(!req.user || req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Product ID is required.' });

    var productID = req.params['id'];
    var uniqID = uniqid();
    var pathArrays = req.body;

    for(let i = 0; i < pathArrays.length; i++){
        var updatedProduct = await Product.findByIdAndUpdate(productID, {
            $push: {
                gallery: {
                    _id: uniqid(), path: pathArrays[i]
                }
            }
        })
    }

    var updatedProduct = await Product.findById(productID);
    return res.status(200).send({ product: updatedProduct});
}

const getById = async function(req, res){
    if(!req.params['id']) return res.status(200).send({ message: 'Product ID is required.' });

    var id = req.params['id'];

    try {
        var product = await Product.findById(id);

        return res.status(200).send({ product: product})
    }catch(err){
        return res.status(200).send({ message: 'Product not found.' })
    }
}

const postReview = async function(req, res){
    if(!req.params['id']) return res.status(200).send({ message: 'Product ID is required.' });

    var productID = req.params['id'];
    var params = req.body;

    try{
        let newReview = await Product.findByIdAndUpdate(productID, {
            $push: {
                reviews: {
                    customerID: params.customerId,
                    rating: params.rating,
                    content: params.content,
                    createdAt: Date.now()
                }
            }
        })

        return res.status(200).send({ message: 'Review created successfully. ' });
    }catch(err){
        return res.status(500).send({ message: 'Error trying to create review. Try again.' })
    }
    
}


module.exports = {
    add,
    products,
    edit,
    getById,
    remove,
    uploadCoverImage,
    uploadGalleryImages,
    setGalleryImages,
    productsByCategory,
    postReview
}