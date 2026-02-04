// This file is for Vercel serverless deployment
// For local development, use: npm run dev (which runs index-local.js)

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ 
        message: 'Restaurant API is running on Vercel!',
        endpoints: {
            orders: '/api/orders',
            sendOrder: '/api/send-order',
            deleteOrder: '/api/orders/:id',
            clearOrders: '/api/clear-orders',
            test: '/api/test',
            health: '/api/health'
        }
    });
}
