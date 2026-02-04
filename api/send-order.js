import { connectDB, Order } from './db.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        await connectDB();
        
        const { customerName, customerPhone, customerAddress, orderItems, subtotal, deliveryFee, total } = req.body;
        
        if (!customerName || !customerPhone || !customerAddress || !orderItems) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const order = new Order({
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_address: customerAddress,
            order_items: orderItems,
            subtotal: subtotal,
            delivery_fee: deliveryFee,
            total: total,
            status: 'pending'
        });
        
        const savedOrder = await order.save();
        console.log(`✅ Order saved: ${customerName} - ${customerPhone} - ₹${total}`);
        
        res.status(200).json({ 
            success: true, 
            message: 'Order received successfully!',
            orderId: savedOrder._id
        });
    } catch (err) {
        console.error('❌ API Error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
}