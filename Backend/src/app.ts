import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import authRoutes from './routes/authRoutes';
import './wsServer';

dotenv.config();
const PORT = Number(process.env.PORT) || 5000;
const SERVER_IP = process.env.SERVER_IP || '0.0.0.0';

const app = express();

app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017';
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

app.listen(PORT, SERVER_IP, () => {
    console.log(`HTTP SERVER STARTED ON IP ${SERVER_IP} on PORT ${PORT}`);
});

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || true,
}));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});
