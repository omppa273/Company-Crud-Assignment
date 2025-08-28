// src/config/database.js
const { Sequelize } = require('sequelize');

console.log('🔍 Database Config Loading...');
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASS: ${process.env.DB_PASS ? '***hidden***' : 'NOT SET'}`);

// First connection without specific database (to create database)
const createDatabaseConnection = new Sequelize(
    'postgres', // Connect to default postgres database
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false
    }
);

// Main application database connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER, 
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // Set to console.log to see SQL queries
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const createDatabase = async () => {
    try {
        console.log('🔌 Connecting to PostgreSQL server...');
        // Connect to postgres database first
        await createDatabaseConnection.authenticate();
        console.log('✅ Connected to PostgreSQL server');

        // List all databases first
        console.log('📋 Checking existing databases...');
        const [existingDbs] = await createDatabaseConnection.query(
            "SELECT datname FROM pg_database WHERE datistemplate = false;"
        );
        console.log('📋 Existing databases:', existingDbs.map(db => db.datname));

        // Check if database exists
        const [results] = await createDatabaseConnection.query(
            `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`
        );

        if (results.length === 0) {
            // Database doesn't exist, create it
            console.log(`🔧 Creating database '${process.env.DB_NAME}'...`);
            await createDatabaseConnection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database '${process.env.DB_NAME}' created successfully!`);
            
            // Verify creation
            const [newResults] = await createDatabaseConnection.query(
                `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`
            );
            if (newResults.length > 0) {
                console.log(`✅ Verified: Database '${process.env.DB_NAME}' now exists!`);
            }
        } else {
            console.log(`✅ Database '${process.env.DB_NAME}' already exists`);
        }

        // Close the postgres connection
        await createDatabaseConnection.close();
        
    } catch (error) {
        console.error('❌ Database creation failed:', error.message);
        throw error;
    }
};

const connectDB = async () => {
    try {
        // First create database if it doesn't exist
        await createDatabase();
        
        // Then connect to our application database
        console.log('🔌 Connecting to application database...');
        await sequelize.authenticate();
        console.log('✅ Connected to application database successfully!');
        
        // Test the database by creating a simple table
        console.log('🧪 Testing database with a simple query...');
        await sequelize.query('SELECT version();');
        console.log('✅ Database is working correctly!');
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Full error:', error);
        throw error;
    }
};

module.exports = { sequelize, connectDB };