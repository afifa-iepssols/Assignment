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
const allowedOrigins = [
  "http://localhost:3000",
  "https://assignment-iohpg5wgh-afifa-iepssols-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
