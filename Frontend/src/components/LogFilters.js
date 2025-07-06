import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { logEntrySchema } from '../utils/helpers';

const LogFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [buttonStates, setButtonStates] = useState({
    errorsOnly: false,
    lastHour: false,
    last24Hours: false
  });

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced filter update
  const updateFilters = (newFilters) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onFiltersChange(newFilters);
    }, 300);

    setDebounceTimer(timer);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    updateFilters(newFilters);
  };

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
    setLocalFilters(emptyFilters);
    setButtonStates({
      errorsOnly: false,
      lastHour: false,
      last24Hours: false
    });
    onClearFilters();
  };

  const handleErrorsOnlyClick = () => {
    if (buttonStates.errorsOnly) {
      handleFilterChange('level', '');
      setButtonStates(prev => ({ ...prev, errorsOnly: false }));
    } else {
      handleFilterChange('level', 'error');
      setButtonStates(prev => ({ ...prev, errorsOnly: true }));
    }
  };

  const handleLastHourClick = () => {
    if (buttonStates.lastHour) {
      handleFilterChange('timestamp_start', '');
      setButtonStates(prev => ({ ...prev, lastHour: false }));
    } else {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneHourAgoString = oneHourAgo.toISOString().slice(0, 16);
      handleFilterChange('timestamp_start', oneHourAgoString);
      setButtonStates(prev => ({ ...prev, lastHour: true }));
    }
  };

  const handleLast24HoursClick = () => {
    if (buttonStates.last24Hours) {
      handleFilterChange('timestamp_start', '');
      setButtonStates(prev => ({ ...prev, last24Hours: false }));
    } else {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneDayAgoString = oneDayAgo.toISOString().slice(0, 16);
      handleFilterChange('timestamp_start', oneDayAgoString);
      setButtonStates(prev => ({ ...prev, last24Hours: true }));
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  return (
    <div className="card mb-6">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter size={20} />
            <h2 className="font-semibold">Filter Logs</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="btn btn-danger btn-sm"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>
      </div>


      <div className="card-body">

        {/* Quick Filter Buttons */}
        <div className="mt-4 pt-4 border-t border-border-color">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted mr-2">Quick Filters:</span>
            <button
              onClick={handleErrorsOnlyClick}
              className={`btn btn-sm ${
                buttonStates.errorsOnly ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              Errors Only
            </button>
            <button
              onClick={handleLastHourClick}
              className={`btn btn-sm ${
                buttonStates.lastHour ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              Last Hour
            </button>
            <button
              onClick={handleLast24HoursClick}
              className={`btn btn-sm ${
                buttonStates.last24Hours ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              Last 24 Hours
            </button>
          </div>
        </div>

  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Message Search */}
          <div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Message Search
              </label>
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
            </div>
            <div className="relative">
              <input
                type="text"
                className="input pl-10"
                placeholder="Search in messages..."
                value={localFilters.message || ''}
                onChange={(e) => handleFilterChange('message', e.target.value)}
              />
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Log Level
            </label>
            <select
              className={`select ${localFilters.level ? 'bg-gray-100' : ''}`}
              value={localFilters.level || ''}
              onChange={(e) => handleFilterChange('level', e.target.value)}
            >
              <option value="">All Levels</option>
              {logEntrySchema.level.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Resource ID Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Resource ID
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g., server-1234"
              value={localFilters.resourceId || ''}
              onChange={(e) => handleFilterChange('resourceId', e.target.value)}
            />
          </div>

          {/* Trace ID Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Trace ID
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g., abc-xyz-123"
              value={localFilters.traceId || ''}
              onChange={(e) => handleFilterChange('traceId', e.target.value)}
            />
          </div>

          {/* Start Timestamp */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              className={`input ${localFilters.timestamp_start ? 'bg-gray-100' : ''}`}
              value={localFilters.timestamp_start || ''}
              onChange={(e) => handleFilterChange('timestamp_start', e.target.value)}
            />
          </div>

          {/* End Timestamp */}
          <div>
            <label className="block text-sm font-medium mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              className="input"
              value={localFilters.timestamp_end || ''}
              onChange={(e) => handleFilterChange('timestamp_end', e.target.value)}
            />
          </div>

          {/* Span ID Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Span ID
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g., span-456"
              value={localFilters.spanId || ''}
              onChange={(e) => handleFilterChange('spanId', e.target.value)}
            />
          </div>

          {/* Commit Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Commit Hash
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g., 5e5342f"
              value={localFilters.commit || ''}
              onChange={(e) => handleFilterChange('commit', e.target.value)}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LogFilters; 