const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const contentRoutes = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/content', contentRoutes);

// health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'zerosurf-backend',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'endpoint not found' });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🏄‍♂️ ZeroSurf backend running on port ${PORT}`);
  console.log(`🔍 Content filtering service active`);
});