import React from 'react';
import { Link } from 'react-router-dom';
import './ShipmentCard.css';

const ShipmentCard = ({ shipment, onUpdate }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#ffc107',
      in_transit: '#17a2b8',
      out_for_delivery: '#fd7e14',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return statusColors[status] || '#6c757d';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'Pending',
      in_transit: 'In Transit',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusTexts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="shipment-card">
      <div className="shipment-header">
        <h3 className="tracking-number">{shipment.trackingNumber}</h3>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(shipment.status) }}
        >
          {getStatusText(shipment.status)}
        </span>
      </div>

      <p className="shipment-description">{shipment.description}</p>

      <div className="shipment-details">
        <div className="detail-row">
          <span className="detail-label">From:</span>
          <span className="detail-value">
            {shipment.origin.city}, {shipment.origin.country}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">To:</span>
          <span className="detail-value">
            {shipment.destination.city}, {shipment.destination.country}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Est. Delivery:</span>
          <span className="detail-value">
            {formatDate(shipment.estimatedDelivery)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Fragile:</span>
          <span className="detail-value">
            {shipment.isFragile ? 'Yes - Handle with Care' : 'No'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Shipping Method:</span>
          <span className="detail-value capitalize">
            {shipment.shippingMethod}
          </span>
        </div>
      </div>

      <div className="shipment-footer">
        <div className="shipment-actions">
          <Link to={`/shipments/edit/${shipment._id}`} className="edit-btn">
            Edit
          </Link>
          <button 
            className="delete-btn"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this shipment?')) {
                // Delete functionality to be implemented
                console.log('Delete shipment:', shipment._id);
              }
            }}
          >
            Delete
          </button>
        </div>
        <div className="shipment-dates">
          <small>Created: {formatDate(shipment.createdAt)}</small>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCard;