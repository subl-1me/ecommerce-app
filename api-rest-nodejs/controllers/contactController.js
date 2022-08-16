'use strict'

const Contact = require('../models/contact');

const sendMessage = async function(req, res){

    var data = req.body;

    try{
        let newMessage = await Contact.create(data);

        return res.status(200).send({ message: newMessage })
    }catch(err){
        return res.status(500).send({error: 'Something went wrong' });
    }
}

const messages = async function(req, res){
    try {

        var messages = await Contact.find();
        if(!messages) return res.status(200).send({ message: 'List empty.' })

        return res.status(200).send({ messages: messages})
    }catch(err){
        return res.status(500).send({ message: 'Error trying to get messages.' });
    }
}

const closeMessage = async function(req, res){
    if(!req.params['id']) return res.status(200).send({ message: 'Message ID is required.' });

    try{
        let messageId = req.params['id'];
        await Contact.findByIdAndUpdate(messageId, {
            status: 'Closed'
        })

        return res.status(200).send({
            status: 'success',
            message: 'Message marked as closed.' 
        });
    }catch(err){
        return res.status(500).send({message: 'Error trying to update this message.' });
    }
}

module.exports = {
    sendMessage,
    messages,
    closeMessage
}