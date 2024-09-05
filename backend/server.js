const express = require('express');
const cors = require('cors')

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const { authenticateJWT } = require('./middleware/authMiddleware');

const app = express();
app.use(cors())
app.use(express.json());

connectDB()

app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateJWT, taskRoutes);
app.use('/api/users', authenticateJWT, userRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
