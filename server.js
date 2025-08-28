// 1. Update your server.js file for production
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database');
const { sequelize } = require('./src/models');
const { seedSkills } = require('./src/utils/seedSkills');
const apiRoutes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Production CORS - Add your future frontend URLs
const allowedOrigins = [
  'http://localhost:4200',                    // Local development
  'https://your-app-name.netlify.app',       // Will update this later
  'https://company-crud-frontend.netlify.app' // Example - update with your actual URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // For now, allow all origins
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', apiRoutes);

// Root route - helpful for testing
app.get('/', (req, res) => {
    res.json({
        message: 'Company CRUD API is running on Render! 🚀',
        status: 'success',
        environment: process.env.NODE_ENV || 'production',
        endpoints: {
            companies: '/api/companies',
            skills: '/api/master/skills',
            designations: '/api/master/designations',
            health: '/api/health'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check for Render
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server function
const startServer = async () => {
    try {
        console.log('🔌 Connecting to database...');
        await connectDB();
        
        console.log('🔄 Syncing database models...');
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synced!');
        
        await seedSkills();
        
        app.listen(PORT, '0.0.0.0', () => { // Important: bind to 0.0.0.0 for Render
            console.log('');
            console.log('🎉 ===============================================');
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
            console.log(`🌐 Render URL will be provided after deployment`);
            console.log('');
            console.log('📋 Available API Endpoints:');
            console.log(`   GET    /api/companies`);
            console.log(`   POST   /api/companies`);
            console.log(`   PUT    /api/companies/:id`);
            console.log(`   DELETE /api/companies/:id`);
            console.log(`   GET    /api/master/skills`);
            console.log(`   GET    /api/master/designations`);
            console.log('🎉 ===============================================');
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();