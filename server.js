require('dotenv').config();
import express, { json } from 'express';
import connectDB from './config/db';
import cors from 'cors';

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/schedules', require('./routes/api/schedules'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 