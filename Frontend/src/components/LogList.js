import React from 'react';
import { FileText, AlertCircle, Loader } from 'lucide-react';
import LogEntry from './LogEntry';

const LogList = ({ logs, loading, error, totalCount }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="flex items-center gap-3">
          <Loader className="spinner" />
          <span>Loading logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-error-color" />
          <h3 className="font-semibold mb-2">Error Loading Logs</h3>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <FileText size={48} className="mx-auto mb-4 text-muted" />
          <h3 className="font-semibold mb-2">No Logs Found</h3>
          <p className="text-muted">
            {totalCount === 0 
              ? "No logs have been ingested yet. Try adding some logs via the API."
              : "No logs match your current filters. Try adjusting your search criteria."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results Summary */}
      <div className="mb-4 p-3 bg-primary-color bg-opacity-10 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Showing {logs.length} log{logs.length !== 1 ? 's' : ''}
            {totalCount !== undefined && totalCount !== logs.length && (
              <span className="text-muted"> of {totalCount}</span>
            )}
          </span>
          <span className="text-xs text-muted">
            Sorted by timestamp (most recent first)
          </span>
        </div>
      </div>

      {/* Log Entries */}
      <div className="space-y-3">
        {logs.map((log, index) => (
          <LogEntry key={`${log.timestamp}-${log.traceId}-${index}`} log={log} />
        ))}
      </div>

      {/* End of Results */}
      {logs.length > 0 && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
            <FileText size={16} className="text-muted" />
            <span className="text-sm text-muted">
              End of results
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogList; 