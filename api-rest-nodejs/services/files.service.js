'use strict'

const fs = require('fs');

const deleteFile = function (directoryPath, name){
    fs.readdir(directoryPath, function(err, _files){
        if(err) throw new Error('Error reading folder.');

        fs.unlink(directoryPath + name, function(err){
            if(err) throw new Error('Error trying to delete file.');

        })
    })
}

// Products ID directory
const createDirectory = function(directoryPath, id){
    if(!id || !directoryPath) throw new Error('Directory path or ID is required.');

    const newDir = directoryPath + 'gallery-' + id;
    if(fs.existsSync(newDir)) return;

    fs.mkdirSync(newDir);

    return;
}

module.exports = {
    deleteFile,
    createDirectory
}