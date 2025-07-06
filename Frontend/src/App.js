import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Database, RefreshCw } from 'lucide-react';
import { logApi } from './services/api';
import LogFilters from './components/LogFilters';
import LogList from './components/LogList';

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    level: '',
    message: '',
    resourceId: '',
    timestamp_start: '',
    timestamp_end: '',
    traceId: '',
    spanId: '',
    commit: ''
  });
  const [serverStatus, setServerStatus] = useState('checking');

  // Fetch logs with current filters
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logApi.getLogs(filters);
      setLogs(data);
    } catch (err) {
      setError(err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Check server health
  const checkServerHealth = useCallback(async () => {
    try {
      await logApi.healthCheck();
      setServerStatus('healthy');
    } catch (err) {
      setServerStatus('unhealthy');
    }
  }, []);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const emptyFilters = {
      level: '',
      message: '',
      resourceId: '',
      timestamp_start: '',
      timestamp_end: '',
      traceId: '',
      spanId: '',
      commit: ''
    };
    setFilters(emptyFilters);
  };

  // Refresh logs
  const handleRefresh = () => {
    fetchLogs();
  };

  // Initial load
  useEffect(() => {
    checkServerHealth();
    fetchLogs();
  }, [checkServerHealth, fetchLogs]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (serverStatus === 'healthy') {
        fetchLogs();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchLogs, serverStatus]);

  return (
    <div className="min-h-screen bg-bg-secondary">

      {/* Header */}
      <header className="bg-bg-primary border-b border-border-color shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-color rounded-lg">
                <Database size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Log Query System</h1>
                <p className="text-sm text-muted">Monitor and debug your applications</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Server Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  serverStatus === 'healthy' ? 'bg-success-color' : 
                  serverStatus === 'unhealthy' ? 'bg-error-color' : 'bg-warning-color'
                }`} />
                <span className="text-sm text-muted">
                  {serverStatus === 'healthy' ? 'Server Online' :
                   serverStatus === 'unhealthy' ? 'Server Offline' : 'Checking...'}
                </span>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="btn btn-secondary"
                title="Refresh logs"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">

        {/* Filters */}
        <LogFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Logs */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <Activity size={20} />
              <h2 className="font-semibold">Log Entries</h2>
            </div>
          </div>
          <div className="card-body">
            <LogList
              logs={logs}
              loading={loading}
              error={error}
              totalCount={logs.length}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 