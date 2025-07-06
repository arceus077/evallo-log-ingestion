// Utility functions for log formatting and styling

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleString();
  } catch (error) {
    return timestamp;
  }
};

// Get color for log level
export const getLevelColor = (level) => {
  const colors = {
    error: 'var(--error-color)',
    warn: 'var(--warning-color)',
    info: 'var(--info-color)',
    debug: 'var(--debug-color)'
  };
  return colors[level] || colors.info;
};

// Get CSS class for log level badge
export const getLevelBadgeClass = (level) => {
  return `badge badge-${level}`;
};

// Log entry schema
export const logEntrySchema = {
  level: ['error', 'warn', 'info', 'debug'],
  message: '',
  resourceId: '',
  timestamp: '',
  traceId: '',
  spanId: '',
  commit: '',
  metadata: {}
}; 