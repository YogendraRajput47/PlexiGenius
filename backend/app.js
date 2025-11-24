// src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');      // we'll add these routes next
const leadsRoutes = require('./routes/leads');
const employeesRoutes = require('./routes/employees');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');




const app = express();

// middlewares
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form bodies
app.use(cors({
  origin: "https://plexigenius-6qyy.onrender.com",
  credentials: true
}));


// routes (placeholders for now - files will be added soon)
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/employees', employeesRoutes);

app.get("/", (req, res) => {
  res.send("PlexiGenius Backend is running");
});

// global error handler
app.use(errorHandler);

module.exports = app;
