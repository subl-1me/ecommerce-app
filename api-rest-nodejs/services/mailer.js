'use strict'

const fs = require('fs');
const handlebars = require('handlebars');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const path = require('path');

// Models
const Sale = require('../models/sale');
const SaleDetail = require('../models/saleDetail');

//giicmgaatntckzds

const initMailer = async function(saleId){
    const readHTMLFile = function(path, callback){
        fs.readFile(path, { encoding: 'utf-8'}, function(err, html){
            if(err){
                throw err;
                callback(err);
            }else{
                callback(null, html);
            }
        })
    }
    
    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gamil.com',
        auth:{
            user: 'headshotmusic404@gmail.com',
            pass: 'giicmgaatntckzds'
        }
    }));

    // Get customer data
    const sale = await Sale.findById({_id:saleId}).populate('customer');
    const saleDetail = await SaleDetail.find({sale: saleId}).populate('product');


    const data = {
        customerNames: sale.customer.names + ' ' + sale.customer.surnames,
        saleDate: new Date(sale.createdAt),
        subtotal: sale.subtotal,
        customerEmail: sale.customer.email,
        saleDetail: saleDetail
    }

    // Send sale detail to html template
    readHTMLFile(process.cwd() + '/mail-template.html', (err, html) =>{
        let rest_html = ejs.render(html, { data: data });
    
        var template = handlebars.compile(rest_html);
        var htmlToSend = template({ op:true })
    
        var mailOptions = {
            from: 'headshotmusic404@gmail.com',
            to: 'subl1metype@gmail.com',
            subject: 'A shop...',
            html: htmlToSend
        };
    
        // res.status(200).send({ data: true });
        transporter.sendMail(mailOptions, function(err, info) {
            if(!err){
                console.log('Email sent successfully to: ' + sale.customer.email);
            }
        })
    })
}

module.exports = {
    initMailer,
}