import { connectDB } from './db.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await connectDB();
        res.status(200).json({ 
            status: 'healthy',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || 'production'
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'unhealthy',
            error: err.message 
        });
    }
}
