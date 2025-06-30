import 'dotenv/config';
import express, { json } from 'express';
import connectDB from './config/db.js';
import cors from 'cors';

import users from './routes/api/users.js';
import auth from './routes/api/auth.js';
import schedules from './routes/api/schedules.js';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger.js';

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors({ origin: '*' }));
app.use(json({ limit: '50mb', extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/schedules', schedules);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 