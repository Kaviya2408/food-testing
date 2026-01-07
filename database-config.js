// Database configuration for MongoDB
const config = {
    // For Vercel production - use environment variables
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    database: process.env.DB_NAME || 'hotelusers',
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    
    // For local development - fallback
    local: {
        host: 'localhost',
        port: 27017,
        database: 'hotelusers',
        username: '',
        password: ''
    }
};

// Use appropriate config based on environment
const getConfig = () => {
    // Check if we're on Vercel
    const isVercel = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    
    if (isVercel) {
        console.log('🌐 Using Vercel production config');
        return {
            host: config.host,
            port: config.port,
            database: config.database,
            username: config.username,
            password: config.password,
            isProduction: true
        };
    } else {
        console.log('🏠 Using local development config');
        return config.local;
    }
};

// Get MongoDB connection string
const getMongoURI = (config) => {
    const { host, port, database, username, password } = config;
    
    if (username && password) {
        return `mongodb://${username}:${password}@${host}:${port}/${database}`;
    } else {
        return `mongodb://${host}:${port}/${database}`;
    }
};

module.exports = { getConfig, getMongoURI };
