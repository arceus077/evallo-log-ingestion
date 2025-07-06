const express = require('express');
const cors = require('cors');

// Import API routes
const logsRouter = require('./routes/logs');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/logs', logsRouter);
app.use('/health', healthRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Log ingestion server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints:`);
  console.log(`  POST http://localhost:${PORT}/logs - Ingest a log entry`);
  console.log(`  GET  http://localhost:${PORT}/logs - Retrieve and filter logs`);
}); 