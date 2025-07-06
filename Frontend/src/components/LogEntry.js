import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { formatTimestamp, getLevelBadgeClass } from '../utils/helpers';

const LogEntry = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getLevelBorderColor = (level) => {
    const colors = {
      error: 'border-l-error-color',
      warn: 'border-l-warning-color',
      info: 'border-l-info-color',
      debug: 'border-l-debug-color'
    };
    return colors[level] || colors.info;
  };

  const formatMetadata = (metadata) => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return 'No metadata';
    }
    return JSON.stringify(metadata, null, 2);
  };

  return (
    <div className={`card mb-3 border-l-4 ${getLevelBorderColor(log.level)}`}>
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={toggleExpanded}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            <span className={getLevelBadgeClass(log.level)}>
              {log.level.toUpperCase()}
            </span>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{log.message}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-muted">
              {formatTimestamp(log.timestamp)}
            </span>
            <button
              onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy log entry"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border-color">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div>
                <h4 className="font-semibold mb-3">Basic Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted">Resource ID:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm break-all">{log.resourceId}</code>
                      <button
                        onClick={() => copyToClipboard(log.resourceId)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy Resource ID"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted">Trace ID:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm break-all">{log.traceId}</code>
                      <button
                        onClick={() => copyToClipboard(log.traceId)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy Trace ID"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted">Span ID:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm break-all">{log.spanId}</code>
                      <button
                        onClick={() => copyToClipboard(log.spanId)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy Span ID"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-muted">Commit:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm break-all">{log.commit}</code>
                      <button
                        onClick={() => copyToClipboard(log.commit)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy Commit Hash"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h4 className="font-semibold mb-3">Metadata</h4>
                <div className="bg-gray-50 p-3 rounded border">
                  <pre className="text-xs overflow-auto max-h-32">
                    {formatMetadata(log.metadata)}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(formatMetadata(log.metadata))}
                    className="mt-2 btn btn-secondary btn-sm"
                  >
                    <Copy size={12} />
                    Copy Metadata
                  </button>
                </div>
              </div>
            </div>

            {/* Raw JSON */}
            <div className="mt-4">
              <h4 className="font-semibold mb-3">Raw JSON</h4>
              <div className="bg-gray-50 p-3 rounded border">
                <pre className="text-xs overflow-auto max-h-32">
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogEntry; 