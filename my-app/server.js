const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
const Report = require('./models/Report');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your_jwt_secret';

// Connect to MongoDB
mongoose.connect('mongodb+srv://Shock_22:Mongo1234@testcluster.oagudfc.mongodb.net/User', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Register route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Home route
app.get('/home', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });
    res.json({ message: `Welcome, ${decoded.name}`, user: decoded });
  });
});

// Report route
app.post('/report', upload.single('image'), (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

    const { description, location } = req.body;
    const imagePath = req.file ? req.file.path : null;

    const newReport = new Report({
      username: decoded.name,
      description,
      location,
      image: imagePath,
      status: 'Submitted' // Default status
    });

    try {
      const savedReport = await newReport.save();
      console.log('Report saved:', savedReport);
      res.status(201).json(savedReport);
    } catch (error) {
      console.error('Error saving report:', error);
      res.status(500).json({ message: 'Error saving report', error });
    }
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Update report status route
app.put('/api/reports/:reportId', async (req, res) => {
  const { status } = req.body;
  const { reportId } = req.params;

  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reports route
app.get('/api/reports', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

    try {
      const reports = await Report.find({ username: decoded.name });
      res.json(reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
