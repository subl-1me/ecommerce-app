'use strict'

const fs = require('fs');
const Product = require('../models/product');


exports.clean = function(directoryPath){
    fs.readdir(directoryPath, function(err, files){
        if(err) throw new Error('Error reading folder.');

        // Delete all content
        files.forEach(function(file){
            fs.unlink(directoryPath + file, function(err){
                if(err) throw new Error('Error trying to delete file.');

                console.log('Deleting: ' + directoryPath + file);
            })
        })
    });
}

exports.createDir = function(){

    var newDir = './' + productID;
    if(!fs.existsSync(newDir)) fs.mkdirSync(newDir);

    return newDir;
}