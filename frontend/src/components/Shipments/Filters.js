import React, { useState } from 'react';

const Filters = ({ onFilterChange, currentFilters }) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { status: '', isFragile: '', sortBy: 'createdAt:desc' };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label>Status:</label>
        <select 
          value={localFilters.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Fragile:</label>
        <select 
          value={localFilters.isFragile} 
          onChange={(e) => handleFilterChange('isFragile', e.target.value)}
        >
          <option value="">All Items</option>
          <option value="true">Fragile Only</option>
          <option value="false">Non-Fragile Only</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Sort By:</label>
        <select 
          value={localFilters.sortBy} 
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          <option value="createdAt:desc">Newest First</option>
          <option value="createdAt:asc">Oldest First</option>
          <option value="estimatedDelivery:asc">Delivery Date (Asc)</option>
          <option value="estimatedDelivery:desc">Delivery Date (Desc)</option>
        </select>
      </div>

      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;