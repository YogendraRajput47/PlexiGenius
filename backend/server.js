// src/server.js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');



const connectDB=require('./config/dbConnect');

app.listen(process.env.PORT || 5000, async () => {
  try {
    await connectDB();  
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  } catch (error) {
    console.error('Failed to connect to the database', error);
  }
});


