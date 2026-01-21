const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dbConfig = require('../database-config');

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Order schema for MongoDB
const orderSchema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    customer_address: { type: String, required: true },
    order_items: { type: Array, required: true },
    subtotal: { type: Number, required: true },
    delivery_fee: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Connect to MongoDB and start server
const uri = `mongodb+srv://${process.env.DB_USER || dbConfig.user}:${encodeURIComponent(process.env.DB_PASSWORD || dbConfig.password)}@${process.env.DB_HOST || dbConfig.host}/${process.env.DB_NAME || dbConfig.dbName}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB Atlas connected');
    startServer();
}).catch(err => {
    console.error('❌ MongoDB connection failed:', err);
});

function startServer() {
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({ 
            status: 'healthy',
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || 'development'
        });
    });

    // Test endpoint
    app.get('/test', (req, res) => {
        res.json({ 
            message: 'API is working!',
            timestamp: new Date().toISOString()
        });
    });

    // Get all orders endpoint
    app.get('/orders', async (req, res) => {
        try {
            const orders = await Order.find().sort({ created_at: -1 });
            console.log(`📊 Admin panel: ${orders.length} orders found`);
            res.json(orders);
        } catch (err) {
            console.error('❌ Error fetching orders:', err);
            return res.status(500).json({ error: 'Database error' });
        }
    });

    // Send order endpoint
    app.post('/send-order', async (req, res) => {
        try {
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
            
            res.json({ 
                success: true, 
                message: 'Order received successfully!',
                orderId: savedOrder._id
            });
        } catch (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
    });

    // Clear all orders endpoint
    app.delete('/clear-orders', async (req, res) => {
        try {
            const result = await Order.deleteMany({});
            console.log(`✅ Cleared ${result.deletedCount} orders`);
            res.json({ 
                success: true, 
                message: `Cleared ${result.deletedCount} orders`,
                clearedCount: result.deletedCount
            });
        } catch (err) {
            console.error('❌ Error clearing orders:', err);
            return res.status(500).json({ error: 'Database error' });
        }
    });

    // Delete single order endpoint
    app.delete('/orders/:id', async (req, res) => {
        try {
            const orderId = req.params.id;
            
            console.log(`🔍 DELETE request received for order ID: ${orderId}`);

            if (!orderId) {
                return res.status(400).json({ error: 'Invalid order ID' });
            }

            const { Types } = require('mongoose');
            if (!Types.ObjectId.isValid(orderId)) {
                return res.status(400).json({ error: 'Invalid order ID format' });
            }

            const result = await Order.findByIdAndDelete(orderId);
            if (!result) {
                return res.status(404).json({ error: 'Order not found' });
            }
            
            console.log(`✅ Order ${orderId} deleted successfully`);
            res.json({ 
                success: true, 
                message: 'Order deleted successfully',
                deletedOrderId: orderId
            });
        } catch (err) {
            console.error('❌ Error deleting order:', err);
            console.error('❌ Error stack:', err.stack);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 API server running on port ${PORT}`);
    });
}

module.exports = app;
