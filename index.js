console.log('Starting server...');

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const dbConfig = require('./database-config');

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// Database connection with Vercel/local config
const db = mysql.createConnection(dbConfig());

db.connect((err) => {
    if (err) {
        console.log('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Database connected');
    
    // Create orders table if not exists (but don't fail if it exists)
    const createOrdersTable = `
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_name VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(20) NOT NULL,
            customer_address TEXT NOT NULL,
            order_items TEXT NOT NULL,
            subtotal DECIMAL(10,2) NOT NULL,
            delivery_fee DECIMAL(10,2) NOT NULL,
            total DECIMAL(10,2) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.query(createOrdersTable, (err, result) => {
        if (err) {
            console.log("❌ Orders Table Error:", err);
        } else {
            console.log("✅ Orders table ready");
        }
        
        startServer();
    });
});

function startServer() {
    // Redirect root to index.html
    app.get('/', (req, res) => {
        res.redirect('/index.html');
    });

    app.post('/send-order', (req, res) => {
        const { customerName, customerPhone, customerAddress, orderItems, subtotal, deliveryFee, total } = req.body;
        
        if (!customerName || !customerPhone || !customerAddress || !orderItems) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const orderQuery = 'INSERT INTO orders (customer_name, customer_phone, customer_address, order_items, subtotal, delivery_fee, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const orderItemsJson = JSON.stringify(orderItems);
        
        db.query(orderQuery, [customerName, customerPhone, customerAddress, orderItemsJson, subtotal, deliveryFee, total, 'pending'], (err, result) => {
            if (err) {
                console.error('❌ Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            console.log(`✅ Order saved: ${customerName} - ${customerPhone} - ₹${total}`);
            
            res.json({ 
                success: true, 
                message: 'Order received successfully!',
                orderId: result.insertId
            });
        });
    });

    // Get all orders endpoint - handle both /orders and /orders/
    app.get('/orders', (req, res) => {
        const sql = "SELECT * FROM orders ORDER BY id DESC";
        db.query(sql, (err, results) => {
            if (err) {
                console.error('❌ Error fetching orders:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            console.log(`📊 Admin panel: ${results.length} orders found`);
            res.json(results);
        });
    });

    app.get('/orders/', (req, res) => {
        const sql = "SELECT * FROM orders ORDER BY id DESC";
        db.query(sql, (err, results) => {
            if (err) {
                console.error('❌ Error fetching orders:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            console.log(`📊 Admin panel: ${results.length} orders found`);
            res.json(results);
        });
    });

    // Clear all orders endpoint
    app.delete('/clear-orders', (req, res) => {
        const sql = "DELETE FROM orders";
        db.query(sql, (err, result) => {
            if (err) {
                console.error('❌ Error clearing orders:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            console.log(`✅ Cleared ${result.affectedRows} orders`);
            res.json({ 
                success: true, 
                message: `Cleared ${result.affectedRows} orders`,
                clearedCount: result.affectedRows
            });
        });
    });

    // Delete single order endpoint
    app.delete('/orders/:id', (req, res) => {
        const orderId = req.params.id;
        
        if (!orderId || isNaN(orderId)) {
            return res.status(400).json({ error: 'Invalid order ID' });
        }
        
        const sql = "DELETE FROM orders WHERE id = ?";
        
        db.query(sql, [orderId], (err, result) => {
            if (err) {
                console.error('❌ Error deleting order:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Order not found' });
            }
            
            console.log(`✅ Order ${orderId} deleted (delivered)`);
            res.json({ 
                success: true, 
                message: 'Order deleted successfully',
                deletedOrderId: orderId
            });
        });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🌐 Restaurant: http://localhost:${PORT}/index.html`);
    });
}
