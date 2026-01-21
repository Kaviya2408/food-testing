// Database configuration for MongoDB
const config = {
    // For Vercel production - use MongoDB Atlas
    host: process.env.DB_HOST || 'cluster0.ummyuou.mongodb.net',
    port: process.env.DB_PORT || 27017,
    database: process.env.DB_NAME || 'hotelusers',
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'Kaviyashree@24',
    
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
    // Check if we're on Vercel or want to use Atlas
    const isVercel = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const useAtlas = process.env.USE_ATLAS === 'true' || isVercel;
    
    if (useAtlas) {
        console.log('🌐 Using MongoDB Atlas config');
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
        // For MongoDB Atlas
        return `mongodb+srv://${username}:${password}@${host}/${database}?retryWrites=true&w=majority`;
    } else {
        // For local development
        return `mongodb://${host}:${port}/${database}`;
    }
};

module.exports = { getConfig, getMongoURI };
