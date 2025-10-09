const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
require('./db'); // connect to MongoDB Atlas

const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root route - Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);

const PORT = process.env.PORT || 3000; // Use Render's port in production, 3000 locally

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

