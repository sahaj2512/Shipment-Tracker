const express = require('express');
const Shipment = require('../models/Shipment');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Apply protection to all routes
router.use(protect);

// CREATE shipment - IMPROVED ERROR HANDLING
router.post('/', async (req, res) => {
  try {
    console.log('📦 Creating shipment for user:', req.user.username);
    
    const shipmentData = {
      ...req.body,
      userId: req.user._id
    };

    // Validate required fields
    const requiredFields = ['trackingNumber', 'description', 'shippingDate', 'distance', 'shippingMethod'];
    const missingFields = requiredFields.filter(field => !shipmentData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check if tracking number already exists for this user
    const existingShipment = await Shipment.findOne({
      trackingNumber: shipmentData.trackingNumber,
      userId: req.user._id
    });

    if (existingShipment) {
      return res.status(400).json({
        status: 'fail',
        message: 'Tracking number already exists'
      });
    }

    const shipment = await Shipment.create(shipmentData);

    console.log('✅ Shipment created successfully:', shipment.trackingNumber);

    res.status(201).json({
      status: 'success',
      data: { shipment }
    });
    
  } catch (error) {
    console.error('❌ Error creating shipment:', error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors
      });
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Tracking number must be unique'
      });
    }

    // General error
    res.status(400).json({
      status: 'fail',
      message: error.message || 'Failed to create shipment'
    });
  }
});
// CREATE shipment
router.post('/', async (req, res) => {
  try {
    console.log('👤 USER DEBUG - Creating shipment for user:', {
      id: req.user._id,
      username: req.user.username
    });
    
    console.log('📦 DEBUG - Request body:', req.body);
    
    const shipmentData = {
      ...req.body,
      userId: req.user._id
    };

    console.log('🔍 DEBUG - Final shipment data with userId:', {
      trackingNumber: shipmentData.trackingNumber,
      userId: shipmentData.userId,
      userMatch: shipmentData.userId.toString() === req.user._id.toString()
    });

    // Check if tracking number already exists for THIS USER
    const existingShipment = await Shipment.findOne({
      trackingNumber: shipmentData.trackingNumber,
      userId: req.user._id  // Important: Check for this specific user
    });

    if (existingShipment) {
      console.log('❌ DUPLICATE - Tracking number exists for user:', req.user.username);
      return res.status(400).json({
        status: 'fail',
        message: 'Tracking number already exists'
      });
    }

    const shipment = await Shipment.create(shipmentData);

    console.log('✅ CREATED - Shipment saved with:', {
      id: shipment._id,
      tracking: shipment.trackingNumber, 
      userId: shipment.userId,
      forUser: req.user.username
    });

    res.status(201).json({
      status: 'success',
      data: { shipment }
    });
    
  } catch (error) {
    console.error('❌ Error creating shipment:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors
      });
    }

    res.status(400).json({
      status: 'fail',
      message: error.message || 'Failed to create shipment'
    });
  }
});

// TEST endpoint - Get shipments without any filters
router.get('/test-debug', async (req, res) => {
  try {
    console.log('🧪 TEST DEBUG - User:', req.user.username, '(ID:', req.user._id + ')');
    
    // Method 1: Get shipments with the user filter
    const shipmentsWithFilter = await Shipment.find({ userId: req.user._id });
    console.log('🔍 With user filter:', shipmentsWithFilter.length, 'shipments');
    
    // Method 2: Get ALL shipments (no filter)
    const allShipments = await Shipment.find();
    console.log('🔍 All shipments in DB:', allShipments.length);
    
    // Method 3: Check if any shipments have this user's ID
    const userShipments = allShipments.filter(s => 
      s.userId && s.userId.toString() === req.user._id.toString()
    );
    console.log('🔍 Shipments belonging to current user:', userShipments.length);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: req.user._id,
          username: req.user.username
        },
        withFilter: shipmentsWithFilter.length,
        allShipments: allShipments.length,
        userShipments: userShipments.length,
        userShipmentsList: userShipments.map(s => ({
          trackingNumber: s.trackingNumber,
          status: s.status,
          userId: s.userId
        }))
      }
    });
    
  } catch (error) {
    console.error('❌ Test debug error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET all shipments
router.get('/', async (req, res) => {
  try {
    console.log('🔐 USER DEBUG - Request user:', {
      id: req.user._id,
      username: req.user.username
    });
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    
    // Debug: Log the filter being used
    const filter = { userId: req.user._id };
    console.log('🔍 FILTER DEBUG - MongoDB filter:', JSON.stringify(filter));
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.isFragile) filter.isFragile = req.query.isFragile === 'true';
    
    console.log('📦 DEBUG - Fetching shipments with filter:', filter);
    
    const shipments = await Shipment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log('✅ DEBUG - Raw MongoDB result count:', shipments.length);
    
    // Log each shipment's user ID to verify ownership
    shipments.forEach((shipment, index) => {
      console.log(`   Shipment ${index + 1}:`, {
        id: shipment._id,
        tracking: shipment.trackingNumber,
        userId: shipment.userId,
        requestUserId: req.user._id,
        match: shipment.userId.toString() === req.user._id.toString()
      });
    });

    const total = await Shipment.countDocuments(filter);

    console.log('✅ FINAL - Sending', shipments.length, 'shipments to frontend');

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
    console.error('❌ Error fetching shipments:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching shipments'
    });
  }
});

// ... rest of your existing routes (GET, DELETE) remain the same

module.exports = router;