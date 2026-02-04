import { connectDB, Order } from './db.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'DELETE') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        await connectDB();
        const result = await Order.deleteMany({});
        console.log(`✅ Cleared ${result.deletedCount} orders`);
        res.status(200).json({ 
            success: true, 
            message: `Cleared ${result.deletedCount} orders`,
            clearedCount: result.deletedCount
        });
    } catch (err) {
        console.error('❌ API Error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
}
