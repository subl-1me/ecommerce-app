'use strict'

const Config = require('../models/config');

const path = require('path');
const multer = require('multer');
const fs = require('fs');
const _cleanFolder = require('../services/cleanFolder');
const URL = 'http://localhost:4201/';

const directoryPath = path.join(__dirname, '../uploads/configs/');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/configs');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage : storage }).single('image');

const update = async function(req ,res){
    if(!req.user ||  req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Config ID is required' });

    var params = req.body;
    var configID = req.params['id'];

    try{
        var updatedConfig = await Config.findByIdAndUpdate(configID, {
            categories: params.categories,
            shopName: params.shopName,
            logo: params.logo,
            serie: params.serie,
            correlation: params.correlation
        });
        return res.status(200).send({ message: 'Config updated successfully.' });
    }catch(err){
        return res.status(200).send({ message: 'Error updating config.' });
    }
}

const uploadLogo = async function(req, res, next){
    if(!req.user ||  req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Config ID is required' });

    try{
        _cleanFolder.clean(directoryPath);
    }catch(err){
        return res.status(500).send({ message: 'Error trying to upload image.' });
    }

    // Upload new logo & return path
    upload(req, res, (err) => {
        if(err) return res.status(200).send({ message: 'Error saving image.' });

        return res.status(200).send({ path: URL + req.file.filename });
    });

}

const addCategory = async function(req, res){
    if(!req.user ||  req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Config ID is required' });

    var configID = req.params['id'];
    var category = req.body['name'];

    try {
        var updatedConfig = await Config.updateOne(
            { _id: configID },
            { $push: { categories: category } }
        );

        console.log(updatedConfig);
        return res.status(200).send({ message: 'Category Added.' });
    }catch(err){
        return res.status(500).send({ message: 'Server Error.' });
    }

}

const removeCategory = async function(req, res){
    if(!req.user ||  req.user.role !== 'admin') return res.status(403).send({ message: 'You are not authorized.' });
    if(!req.params['id']) return res.status(200).send({ message: 'Config ID is required' });
    if(!req.params['categoryName']) return res.status(200).send({ message: 'Category name is required' });

    var categoryName = req.params['categoryName'];
    var configID = req.params['id'];

    try{
        var updatedConfig = await Config.updateOne(
            { _id: configID },
            { $pull: { categories: categoryName } }
        );

        console.log(updatedConfig);
        return res.status(200).send({ message: 'Category deleted.' });
    }catch(err){
        return res.status(200).send({ message: 'Server Error' });
    }
}

const getConfig = async function(req, res){

    try {
        var actualConfig = await Config.find({ identifier: 1 });

        return res.status(200).send({ actualConfig: actualConfig });
    }catch(err){
        return res.status(500).send({ message: 'Server Error' });
    }
}

// This method will only be activated once
const createInitialConfig = async function(_req, res){

    var testConfig = {
        categories: [],
        shopName: 'test',
        logo: 'test',
        serie: '000',
        correlation: '000001'
    }

    var initialConfig = await Config.create(testConfig);

    if(!initialConfig) return res.status(200).send({ msg: 'nel' });

    return res.status(200).send({ config: initialConfig });

}

module.exports = {
    createInitialConfig,
    getConfig,
    update,
    addCategory,
    removeCategory,
    uploadLogo
}