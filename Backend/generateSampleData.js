const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const { validateLogEntry } = require('./utils/helpers');

// Initialize JSON database
const db = new JsonDB(new Config("logs", true, false, '/'));

// Sample log data generator
const generateSampleLogs = () => {
  const levels = ['error', 'warn', 'info', 'debug'];
  const resourceIds = ['server-1234', 'server-5678', 'api-gateway-01', 'database-cluster-1', 'cache-server-01'];
  const messages = [
    'Failed to connect to database',
    'User authentication successful',
    'API request processed successfully',
    'Cache miss for key: user_profile_123',
    'Database query timeout exceeded',
    'Memory usage at 85%',
    'New user registration completed',
    'Payment processing failed',
    'Backup job started',
    'Email notification sent',
    'File upload completed',
    'Database connection pool exhausted',
    'Rate limit exceeded for IP: 192.168.1.100',
    'SSL certificate expires in 30 days',
    'Service health check passed'
  ];
  
  const sampleLogs = [];
  const now = new Date();
  
  // Generate 50 sample logs over the past 7 days
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const resourceId = resourceIds[Math.floor(Math.random() * resourceIds.length)];
    
    const logEntry = {
      level,
      message,
      resourceId,
      timestamp: timestamp.toISOString(),
      traceId: `trace-${Math.random().toString(36).substr(2, 9)}`,
      spanId: `span-${Math.random().toString(36).substr(2, 9)}`,
      commit: Math.random().toString(16).substr(2, 7),
      metadata: {
        userId: Math.floor(Math.random() * 1000),
        requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
        duration: Math.floor(Math.random() * 5000),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    sampleLogs.push(logEntry);
  }
  
  return sampleLogs;
};

// Main function to populate the database
const populateDatabase = async () => {
  try {
    console.log('Generating sample log data...');
    const sampleLogs = generateSampleLogs();
    
    console.log(`Generated ${sampleLogs.length} sample log entries`);
    
    // Save to database
    await db.push('/logs', sampleLogs);
    
    console.log('Sample data successfully saved to database!');
    console.log('You can now start the server and test the API endpoints.');
    
    // Display some sample data
    console.log('\nSample log entries:');
    sampleLogs.slice(0, 3).forEach((log, index) => {
      console.log(`${index + 1}. [${log.level.toUpperCase()}] ${log.message} (${log.resourceId})`);
    });
    
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

// Run the script
populateDatabase(); 