import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cardRoutes from './routes/cardRoutes';

dotenv.config();

const app = express();

app.use(express.json());

const mongoUri = process.env.MONGO_URI!;
const mongoOptions: mongoose.ConnectOptions = {
    dbName: 'production-controller',
};

mongoose.connect(mongoUri, mongoOptions)
  .then(() => {
      console.log('MongoDB connected');
  })
  .catch((error) => {
      console.log('MongoDB connection error:', error);
  });

app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

export default app;
