import mongoose from 'mongoose';
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
        
        // Extract order ID from URL path
        const orderId = req.url.split('/api/orders/')[1];
        
        console.log(`🔍 DELETE request received for order ID: ${orderId}`);

        if (!orderId) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID format' });
        }

        const result = await Order.findByIdAndDelete(orderId);
        if (!result) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        console.log(`✅ Order ${orderId} deleted successfully`);
        res.status(200).json({ 
            success: true, 
            message: 'Order deleted successfully',
            deletedOrderId: orderId
        });
    } catch (err) {
        console.error('❌ API Error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
}
