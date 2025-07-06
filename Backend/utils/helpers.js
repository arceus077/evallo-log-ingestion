// Log data schema validation
const validateLogEntry = (logEntry) => {
  const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'];
  const validLevels = ['error', 'warn', 'info', 'debug'];
  
  // Check for required fields
  for (const field of requiredFields) {
    if (!logEntry.hasOwnProperty(field)) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  
  // Validate level
  if (!validLevels.includes(logEntry.level)) {
    return { valid: false, error: `Invalid level. Must be one of: ${validLevels.join(', ')}` };
  }
  
  // Validate timestamp format (ISO 8601)
  const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  if (!timestampRegex.test(logEntry.timestamp)) {
    return { valid: false, error: 'Invalid timestamp format. Must be ISO 8601 format (e.g., 2023-09-15T08:00:00Z)' };
  }
  
  // Validate data types
  if (typeof logEntry.message !== 'string' || typeof logEntry.resourceId !== 'string' || 
      typeof logEntry.traceId !== 'string' || typeof logEntry.spanId !== 'string' || 
      typeof logEntry.commit !== 'string' || typeof logEntry.metadata !== 'object') {
    return { valid: false, error: 'Invalid data types for one or more fields' };
  }
  
  return { valid: true };
};

// Filter logs based on query parameters
const filterLogs = (logs, filters) => {
  return logs.filter(log => {
    // Level filter
    if (filters.level && log.level !== filters.level) {
      return false;
    }
    
    // Message filter (case-insensitive full-text search)
    if (filters.message && !log.message.toLowerCase().includes(filters.message.toLowerCase())) {
      return false;
    }
    
    // ResourceId filter
    if (filters.resourceId && log.resourceId !== filters.resourceId) {
      return false;
    }
    
    // Timestamp range filter
    if (filters.timestamp_start) {
      const startTime = new Date(filters.timestamp_start);
      const logTime = new Date(log.timestamp);
      if (logTime < startTime) {
        return false;
      }
    }
    
    if (filters.timestamp_end) {
      const endTime = new Date(filters.timestamp_end);
      const logTime = new Date(log.timestamp);
      if (logTime > endTime) {
        return false;
      }
    }
    
    // TraceId filter
    if (filters.traceId && log.traceId !== filters.traceId) {
      return false;
    }
    
    // SpanId filter
    if (filters.spanId && log.spanId !== filters.spanId) {
      return false;
    }
    
    // Commit filter
    if (filters.commit && log.commit !== filters.commit) {
      return false;
    }
    
    return true;
  });
};

module.exports = {
  validateLogEntry,
  filterLogs
}; 