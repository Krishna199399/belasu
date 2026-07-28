import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic MongoDB Connection (Atlas or local fallback)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/belesu_db';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to Belesu MongoDB Database'))
  .catch((err) => console.warn('⚠️ MongoDB Connection Notice:', err.message));

// Book Product Schema
const ProductSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  series: String,
  gradeClass: Number,
  price: Number,
  description: String,
  coverImage: String,
  inStock: Boolean,
  stockQuantity: Number,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
  orderId: String,
  customerName: String,
  email: String,
  phone: String,
  address: String,
  items: Array,
  totalAmount: Number,
  paymentMethod: String,
  paymentStatus: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Belesu Express Backend Engine Operational' });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ success: true, message: 'Order created successfully', data: newOrder });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Belesu Express Server listening on port ${PORT}`);
  });
}

export default app;
