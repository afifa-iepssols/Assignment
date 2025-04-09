const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');


require('dotenv').config();

connectDB();
const app = express();
app.use(express.json());
app.use(
    cors({
      origin: 'https://assignment-4d05eup5u-afifa-iepssols-projects.vercel.app', 
      credentials: true, 
    })
);
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/business", businessRoutes);

const port = process.env.PORT || 5002

app.get('/', (req, res) =>  res.send('Server is running!'));
app.listen(port, () => console.log(`server listening on port ${port}`));
