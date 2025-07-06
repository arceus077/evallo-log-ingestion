# Log Ingestion and Querying System

A full-stack application for ingesting, storing, and querying structured log data. Built with Node.js/Express backend and React frontend, this system provides a comprehensive solution for log management and analysis.

## 🚀 Features

### Backend (Node.js/Express)
- **RESTful API** for log ingestion and retrieval
- **JSON file persistence** using node-json-db
- **Comprehensive filtering** with support for multiple criteria
- **Schema validation** for log entries
- **Health check endpoint**
- **Sample data generation** for testing

### Frontend (React)
- **Modern, responsive UI** with clean design
- **Real-time filtering** with debounced search
- **Visual log level indicators** with color coding
- **Expandable log entries** with detailed information
- **Copy-to-clipboard functionality**
- **Auto-refresh capabilities**
- **Server status monitoring**

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Evallo
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
```

## 🚀 Running the Application

### Start the Backend Server
```bash
cd Backend
npm start
```
The backend server will start on `http://localhost:3001`

### Start the Frontend Application
```bash
cd Frontend
npm start
```
The frontend application will start on `http://localhost:3000`

### Generate Sample Data (Optional)
To populate the system with sample log data for testing:
```bash
cd Backend
node generateSampleData.js
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001
```

### Endpoints

#### POST /logs
Ingest a single log entry.

**Request Body:**
```json
{
  "level": "error",
  "message": "Failed to connect to database",
  "resourceId": "server-1234",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "userId": 123,
    "requestId": "req-789",
    "duration": 1500,
    "ipAddress": "192.168.1.100"
  }
}
```

**Response:**
- `201 Created` - Log entry successfully ingested
- `400 Bad Request` - Invalid log entry format
- `500 Internal Server Error` - Server error

#### GET /logs
Retrieve and filter logs.

**Query Parameters:**
- `level` (string) - Filter by log level (error, warn, info, debug)
- `message` (string) - Full-text search in message field
- `resourceId` (string) - Filter by resource ID
- `timestamp_start` (ISO 8601) - Start time for range filter
- `timestamp_end` (ISO 8601) - End time for range filter
- `traceId` (string) - Filter by trace ID
- `spanId` (string) - Filter by span ID
- `commit` (string) - Filter by commit hash

**Example:**
```
GET /logs?level=error&message=database&timestamp_start=2023-09-15T00:00:00Z
```

**Response:**
```json
[
  {
    "level": "error",
    "message": "Failed to connect to database",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": { ... }
  }
]
```

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2023-09-15T08:00:00Z"
}
```

## 🎯 Log Data Schema

All log entries must conform to the following schema:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `level` | string | Yes | Log level (error, warn, info, debug) |
| `message` | string | Yes | Primary log message |
| `resourceId` | string | Yes | Resource identifier |
| `timestamp` | string | Yes | ISO 8601 timestamp |
| `traceId` | string | Yes | Unique trace identifier |
| `spanId` | string | Yes | Unique span identifier |
| `commit` | string | Yes | Git commit hash |
| `metadata` | object | Yes | Additional context data |

## 🔍 Frontend Features

### Filtering Capabilities
- **Message Search**: Case-insensitive full-text search
- **Level Filter**: Filter by log severity
- **Resource ID**: Filter by specific resources
- **Time Range**: Filter by timestamp range
- **Trace/Span ID**: Filter by distributed tracing IDs
- **Commit Hash**: Filter by code version

### Quick Filters
- **Errors Only**: Show only error-level logs
- **Last Hour**: Show logs from the last hour
- **Last 24 Hours**: Show logs from the last day

### Log Display
- **Visual Indicators**: Color-coded log levels
- **Expandable Details**: Click to view full log information
- **Copy Functionality**: Copy individual fields or entire logs
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

### Backend Architecture
```
Backend/
├── routes/
│   ├── logs.js           # Log-related API routes (POST /logs, GET /logs)
│   └── health.js         # Health check API route (GET /health)
├── utils/
│   └── helpers.js        # Validation and filtering functions
├── index.js             # Main Express server (simplified)
├── package.json          # Dependencies and scripts
└── generateSampleData.js # Sample data generator
```

### Frontend Architecture
```
Frontend/
├── public/
│   └── index.html        # Main HTML file
├── src/
│   ├── components/
│   │   ├── LogFilters.js # Filter controls
│   │   ├── LogEntry.js   # Individual log display
│   │   └── LogList.js    # Log list container
│   ├── services/
│   │   └── api.js        # API integration (simplified)
│   ├── utils/
│   │   └── helpers.js    # Utility functions (formatting, styling)
│   ├── App.js            # Main application component
│   ├── index.js          # Application entry point
│   └── index.css         # Global styles
└── package.json          # Dependencies and scripts
```

## 🧪 Testing

### Backend Tests
The backend includes comprehensive unit tests for:
- Log entry validation
- Filtering logic
- Data type validation
- Error handling

Run tests with:
```bash
cd Backend
node test.js
```

### Frontend Testing
The frontend uses React's built-in testing framework:
```bash
cd Frontend
npm test
```

## 🔧 Configuration

### Environment Variables

**Backend:**
- `PORT` - Server port (default: 3001)

**Frontend:**
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:3001)

### Data Persistence
The system uses a single JSON file (`logs.json`) for data storage. This file is automatically created when the first log is ingested.

## 🚀 Deployment

### Development
Both frontend and backend can be run in development mode with hot reloading:

**Backend:**
```bash
cd Backend
npm start
```

**Frontend:**
```bash
cd Frontend
npm start
```

## 🎯 Enhancements Pending

Potential improvements for future versions:
- Real-time WebSocket updates
- Options for sorting
- Unit Tests
- Carts for brtter Visualisation, Insights, etc
- Export functionality (CSV, JSON)
- User authentication and authorization
- Database integration (PostgreSQL, MongoDB)
- Docker containerization

