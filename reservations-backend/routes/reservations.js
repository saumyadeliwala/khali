const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// GET all reservations
router.get('/', async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new reservation
router.post('/', async (req, res) => {
    const reservation = new Reservation({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        time: req.body.time,
        guests: req.body.guests,
        status: req.body.status || 'pending' // Added status field
    });

    try {
        const newReservation = await reservation.save();
        res.status(201).json(newReservation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update reservation status
router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = status;
        await reservation.save();
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating reservation status', error });
    }
});

// DELETE a reservation by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      await reservation.remove();
      res.json({ message: 'Reservation deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting reservation', error: err.message });
    }
  }); 


module.exports = router;
