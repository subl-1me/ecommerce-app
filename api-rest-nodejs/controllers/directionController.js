'use strict'

const Direction = require('../models/direction');

const addCustomerDirection = async function(req, res){

    var data = req.body;

    var newDirection;

    try {
        var directions = await direction.find();
        if(directions.length == 1){
            let newDirection = await Direction.create(data);
            newDirection.isPrincipal = false;
        }else{
            let newDirection = await Direction.create(data);

        }
    }catch(err){
        return res.status(500).send({ message: 'Error trying to add new direction. Try again later.' })

    }

    try {
        var newDirection = await Direction.create(data);

        return res.status(200).send({ direction: newDirection })
    }catch(err){
        return res.status(500).send({ message: 'Error trying to add new direction. Try again later.' })
    }
}

const getDirections = async function(req, res){

    var directionsArray = {};

    try {
        directionsArray = await Direction.find();

        if(directionsArray.length == 0) return res.status(200).send({ message: 'Directions list is empty.' });

        return res.status(200).send({ directions: directionsArray });

    }catch(err){
        return res.status(200).send({ message: 'Error trying to get directions list.' });
    }
}

const removeDirection = async function(req, res){
    if(!req.params['directionID']) return res.status(200).send({ message: 'Direction ID is required.' });

    var directionID = req.params['directionID'];

    try {

        await Direction.findByIdAndDelete(directionID);

        return res.status(200).send({ message: 'Register deleted successfully.' });
    }catch(err){
        return res.status(500).send({ message: 'Error trying to delete direction register.' });
    }
}

const setDirectionAsDefault = async function(req, res){
    if(!req.params['directionID']) return res.status(200).send({ message: 'Direction ID is required.' });
    if(!req.params['customerID']) return res.status(200).send({ message: 'Customer ID is required.' });

    var directionID = req.params['directionID'];
    var customerID = req.params['customerID'];

    try {
        var directions = await Direction.find({customer: customerID});

        for(let direction of directions){
            console.log(direction);
            await Direction.findByIdAndUpdate({_id: direction._id}, { isPrincipal: false });
            console.log(direction);
        }

        await Direction.findByIdAndUpdate({_id: directionID}, { isPrincipal: true });

        if(!directions) return res.status(200).send({ message: 'Direction list is empty.' });

        for(let direction of directions){
            await Direction.findByIdAndUpdate({_id: direction._id}, {principal: false });
            console.log(direction);
        }

        await Direction.findByIdAndUpdate({_id: directionID}, {principal: true});

        return res.status(200).send({ message: 'Default direction changed successfully.' });

        
    }catch(err){
        return res.status(500).send({ message: 'Error trying to update directions.' });
    }
}

const getDefaultDirection = async function(req, res){
    if(!req.params['customerID']) return res.status(200).send({ message: 'Customer ID is required.' });

    var customerID = req.params['customerID'];

    try {
        var defaultDirection = await Direction.findOne({customer: customerID, principal: true});

        if(!defaultDirection) return res.status(200).send({ message: 'No direction default set yet. Add one' });

        return res.status(200).send({ direction: defaultDirection});
    }catch(err){
        return res.status(500).send({ message: 'Error trying to get direction.' });

    }
}

module.exports = {
    addCustomerDirection,
    getDirections,
    removeDirection,
    setDirectionAsDefault,
    getDefaultDirection
}