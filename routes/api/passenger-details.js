const express = require('express');
const router = new express.Router();

const { PassengerModel, PassengerSchema} = require('../../models/Passengers');
const { validateAPIRequest } = require('../../auth.js');

let userCredentials = {};

// Default Validation of all API requests towards Bookings 
router.use('/', (req, res, next) => {
  userCredentials = validateAPIRequest(req, res) || {};
  next()
});

router.get('/getPassenger', (req, res) => {
    userCredentials.signedIn && PassengerModel.find({userEmail: userCredentials.email})
    .then((items) => res.json(items || []), (err) => res.status(400).json({errorMessage: err}));

});

router.post('/addPassenger', (req, res) => {
    const passenger = new PassengerModel({
        ...req.body, ...{userEmail: userCredentials.email}
    });
    userCredentials.signedIn && passenger.save().then((item) => res.status(201).json(item), (err) => res.status(400).json({errorMessage: err}));

});

router.put('/editPassenger/:id', (req, res) => {
    userCredentials.signedIn && PassengerModel.findById(req.params.id)
    .then(passenger => {
        passenger.name = req.body.name;
        passenger.gender = req.body.gender;
        passenger.birthDate = req.body.birthDate;
        passenger.emailId = req.body.emailId;
        passenger.contactNo = req.body.contactNo;
        passenger.passPortNo = req.body.passPortNo;
        passenger.save();
    }).then(() => res.status(201).json({ success: true }))
        .catch(err => res.status(404).json({ success: false}));

});

router.delete('/deletePassenger/:id', (req, res) => {
    userCredentials.signedIn && PassengerModel.findById(req.params.id)
    .then(passenger => passenger.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false}));

});


module.exports = router;