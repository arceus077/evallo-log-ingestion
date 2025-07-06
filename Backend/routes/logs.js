const express = require('express');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const { validateLogEntry, filterLogs } = require('../utils/helpers');

const router = express.Router();

// Initialize JSON database
const db = new JsonDB(new Config("logs", true, false, '/'));

// POST /logs - Ingest a single log entry
router.post('/', async (req, res) => {
  try {
    const logEntry = req.body;
    
    // Validate the log entry
    const validation = validateLogEntry(logEntry);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }
    
    // Get existing logs or initialize empty array
    let logs = [];
    try {
      logs = await db.getData('/logs');
    } catch (error) {
      // If no logs exist yet, start with empty array
      logs = [];
    }
    
    // Add the new log entry
    logs.push(logEntry);
    
    // Save back to database
    await db.push('/logs', logs);
    
    res.status(201).json(logEntry);
  } catch (error) {
    console.error('Error ingesting log:', error);
    res.status(500).json({ error: 'Internal server error during log ingestion' });
  }
});

// GET /logs - Retrieve and filter logs
router.get('/', async (req, res) => {
  try {
    // Get all logs
    let logs = [];
    try {
      logs = await db.getData('/logs');
    } catch (error) {
      // If no logs exist, return empty array
      logs = [];
    }
    
    // Apply filters if provided
    const filters = {
      level: req.query.level,
      message: req.query.message,
      resourceId: req.query.resourceId,
      timestamp_start: req.query.timestamp_start,
      timestamp_end: req.query.timestamp_end,
      traceId: req.query.traceId,
      spanId: req.query.spanId,
      commit: req.query.commit
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) {
        delete filters[key];
      }
    });
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      logs = filterLogs(logs, filters);
    }
    
    // Sort by timestamp in reverse chronological order (most recent first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({ error: 'Internal server error during log retrieval' });
  }
});

module.exports = router; 