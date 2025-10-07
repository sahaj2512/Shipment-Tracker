const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const shipmentRoutes = require('./routes/shipments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);

// Health check with DB status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMessages = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    database: statusMessages[dbStatus] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Handle undefined routes - COMPATIBLE VERSION
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.method} ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.message);
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 'fail',
      message: `Duplicate field value: ${field}. Please use another value.`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Token expired. Please log in again.'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5002;
const MONGODB_URI = process.env.MONGODB_URI;

// Validate environment variables
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  console.log('💡 Please check your .env file');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err.message));


    console.log('✅ MongoDB connected successfully');
    
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`📦 Shipment endpoints: http://localhost:${PORT}/api/shipments`);
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('1. Check if MongoDB is running');
    console.log('2. Verify MONGODB_URI in .env file');
    console.log('3. Check network connectivity');
    console.log('4. For Atlas: Ensure IP is whitelisted');
    
    // Retry connection after 5 seconds
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Process terminated, closing connections...');
  await mongoose.connection.close();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('🚨 Unhandled Promise Rejection:', err.message);
  console.error(err.stack);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

// Start the application
connectDB();

module.exports = app;
