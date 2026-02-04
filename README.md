# 🍽️ Restaurant Order Management System

A complete restaurant ordering system with customer-facing website and admin panel for order management.

## ✨ Features

- 🛒 **Customer Ordering**: Browse menu, add to cart, place orders
- 👨‍💼 **Admin Panel**: View and manage all orders in real-time
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🌐 **Cloud Database**: MongoDB Atlas for reliable data storage
- 🚀 **Vercel Ready**: Optimized for serverless deployment

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Start the server**:
```bash
npm run dev
```

3. **Open in browser**:
- Main website: http://localhost:3000
- Admin panel: http://localhost:3000/admin.html

### Deploy to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Deploy restaurant app"
git push origin main
```

2. **Deploy on Vercel**:
- Go to https://vercel.com
- Import your repository
- Click "Deploy"

3. **Done!** Your restaurant is live on the internet! 🎉

## 📋 Pages

- `/` - Home page
- `/menu.html` - Menu page
- `/cart.html` - Shopping cart
- `/admin.html` - Admin panel (order management)
- `/about.html` - About page
- `/contact.html` - Contact page

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/orders` | GET | Get all orders |
| `/api/send-order` | POST | Submit new order |
| `/api/orders/:id` | DELETE | Delete order |
| `/api/test` | GET | Test API |

## 📱 How It Works

### For Customers:
1. Browse the menu
2. Add items to cart
3. Enter delivery details
4. Place order
5. Order is saved to database

### For Admin:
1. Open admin panel
2. View all orders in real-time
3. See customer details and order items
4. Mark orders as delivered
5. Auto-refreshes every 30 seconds

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express (local) / Serverless Functions (Vercel)
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

## 📚 Documentation

- [Deployment Guide](./DEPLOY-TO-VERCEL.md) - Complete Vercel deployment instructions
- [Local Setup](./README-DEPLOYMENT.md) - Local development guide

## 🎯 Current Status

✅ Local development working
✅ Vercel deployment configured
✅ MongoDB connected
✅ Admin panel functional
✅ Order system operational

## 🔗 Live Demo

**Production URL**: https://tastyfoods-ro5f77vp7-kaviyas-projects-be15d41c.vercel.app/

**Admin Panel**: https://tastyfoods-ro5f77vp7-kaviyas-projects-be15d41c.vercel.app/admin.html

## 📞 Support

For issues or questions, check the troubleshooting section in [DEPLOY-TO-VERCEL.md](./DEPLOY-TO-VERCEL.md)

---

Made with ❤️ for delicious food delivery!
