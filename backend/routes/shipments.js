const express = require('express');
const Shipment = require('../models/Shipment');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Apply protection to all routes
router.use(protect);

// GET all shipments with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { userId: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.isFragile) filter.isFragile = req.query.isFragile === 'true';
    
    // Build sort object
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const shipments = await Shipment.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Shipment.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: shipments.length,
      data: { shipments },
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// GET single shipment
router.get('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!shipment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { shipment }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// CREATE shipment
router.post('/', async (req, res) => {
  try {
    const shipmentData = {
      ...req.body,
      userId: req.user._id
    };

    const shipment = await Shipment.create(shipmentData);

    res.status(201).json({
      status: 'success',
      data: { shipment }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// UPDATE shipment
router.put('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!shipment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { shipment }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

// DELETE shipment
router.delete('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!shipment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Shipment not found'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
});

module.exports = router;