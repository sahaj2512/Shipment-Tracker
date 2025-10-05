const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isFragile: {
    type: Boolean,
    default: false
  },
  origin: {
    address: String,
    city: String,
    country: String
  },
  destination: {
    address: String,
    city: String,
    country: String
  },
  shippingDate: {
    type: Date,
    required: true
  },
  distance: { // Input for calculated field
    type: Number,
    required: true
  },
  shippingMethod: { // Second input for calculated field
    type: String,
    enum: ['standard', 'express', 'overnight'],
    required: true
  },
  estimatedDelivery: { // CALCULATED FIELD
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Calculate estimated delivery before saving
shipmentSchema.pre('save', function(next) {
  let daysToAdd;
  switch (this.shippingMethod) {
    case 'standard':
      daysToAdd = Math.ceil(this.distance / 500); // 500 km per day
      break;
    case 'express':
      daysToAdd = Math.ceil(this.distance / 1000); // 1000 km per day
      break;
    case 'overnight':
      daysToAdd = 1;
      break;
    default:
      daysToAdd = 7;
  }
  
  this.estimatedDelivery = new Date(this.shippingDate);
  this.estimatedDelivery.setDate(this.estimatedDelivery.getDate() + daysToAdd);
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);