import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import authRoutes from './routes/authRoutes';

import './wsServer';

dotenv.config();
const PORT = process.env.PORT || 5000;
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || true,
}));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});
