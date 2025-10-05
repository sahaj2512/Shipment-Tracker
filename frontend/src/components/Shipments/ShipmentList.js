import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ShipmentCard from './ShipmentCard';
import Pagination from '../Common/Pagination';
import Filters from './Filters';
import './Shipments.css';

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    isFragile: '',
    sortBy: 'createdAt:desc'
  });

  const fetchShipments = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '8',
        ...filters
      });

      const response = await axios.get(`/api/shipments?${params}`);
      setShipments(response.data.data.shipments);
      setTotalPages(response.data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments(1);
  }, [filters]);

  const handlePageChange = (page) => {
    fetchShipments(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (loading && shipments.length === 0) {
    return <div className="loading">Loading shipments...</div>;
  }

  return (
    <div className="shipment-list-container">
      <Filters onFilterChange={handleFilterChange} currentFilters={filters} />
      
      <div className="shipments-grid">
        {shipments.map(shipment => (
          <ShipmentCard 
            key={shipment._id} 
            shipment={shipment}
            onUpdate={fetchShipments}
          />
        ))}
      </div>

      {shipments.length === 0 && !loading && (
        <div className="no-shipments">
          <p>No shipments found. Create your first shipment!</p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ShipmentList;