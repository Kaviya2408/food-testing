import mongoose from "mongoose";

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

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    
    try {
        await mongoose.connect(`mongodb+srv://admin:${encodeURIComponent('Kaviyashree@24')}@cluster0.ummyuou.mongodb.net/hotelusers?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
    } catch (err) {
        console.error('MongoDB connection failed:', err);
    }
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        await connectDB();
        const orders = await Order.find().sort({ created_at: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
}