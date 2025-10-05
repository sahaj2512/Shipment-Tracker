import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShipmentForm = ({ shipment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    trackingNumber: '',
    description: '',
    status: 'pending',
    isFragile: false,
    origin: { address: '', city: '', country: '' },
    destination: { address: '', city: '', country: '' },
    shippingDate: '',
    distance: '',
    shippingMethod: 'standard'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (shipment) {
      setFormData({
        trackingNumber: shipment.trackingNumber,
        description: shipment.description,
        status: shipment.status,
        isFragile: shipment.isFragile,
        origin: shipment.origin,
        destination: shipment.destination,
        shippingDate: shipment.shippingDate.split('T')[0],
        distance: shipment.distance,
        shippingMethod: shipment.shippingMethod
      });
    }
  }, [shipment]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('origin.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        origin: { ...prev.origin, [field]: value }
      }));
    } else if (name.startsWith('destination.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        destination: { ...prev.destination, [field]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.trackingNumber.trim()) {
      newErrors.trackingNumber = 'Tracking number is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.shippingDate) {
      newErrors.shippingDate = 'Shipping date is required';
    }
    
    if (!formData.distance || formData.distance <= 0) {
      newErrors.distance = 'Distance must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        distance: parseInt(formData.distance)
      };

      let response;
      if (shipment) {
        response = await axios.put(`/api/shipments/${shipment._id}`, payload);
      } else {
        response = await axios.post('/api/shipments', payload);
      }

      onSave(response.data.data.shipment);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error saving shipment' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shipment-form">
      <h2>{shipment ? 'Edit Shipment' : 'Create New Shipment'}</h2>
      
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>Tracking Number *</label>
          <input
            type="text"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
            required
          />
          {errors.trackingNumber && <span className="error">{errors.trackingNumber}</span>}
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="address-section">
          <h4>Origin</h4>
          <input type="text" name="origin.address" placeholder="Address" value={formData.origin.address} onChange={handleChange} />
          <input type="text" name="origin.city" placeholder="City" value={formData.origin.city} onChange={handleChange} />
          <input type="text" name="origin.country" placeholder="Country" value={formData.origin.country} onChange={handleChange} />
        </div>

        <div className="address-section">
          <h4>Destination</h4>
          <input type="text" name="destination.address" placeholder="Address" value={formData.destination.address} onChange={handleChange} />
          <input type="text" name="destination.city" placeholder="City" value={formData.destination.city} onChange={handleChange} />
          <input type="text" name="destination.country" placeholder="Country" value={formData.destination.country} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Shipping Date *</label>
          <input
            type="date"
            name="shippingDate"
            value={formData.shippingDate}
            onChange={handleChange}
            required
          />
          {errors.shippingDate && <span className="error">{errors.shippingDate}</span>}
        </div>

        <div className="form-group">
          <label>Distance (km) *</label>
          <input
            type="number"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            min="1"
            required
          />
          {errors.distance && <span className="error">{errors.distance}</span>}
        </div>

        <div className="form-group">
          <label>Shipping Method</label>
          <select name="shippingMethod" value={formData.shippingMethod} onChange={handleChange}>
            <option value="standard">Standard (500km/day)</option>
            <option value="express">Express (1000km/day)</option>
            <option value="overnight">Overnight (1 day)</option>
          </select>
        </div>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="isFragile"
            checked={formData.isFragile}
            onChange={handleChange}
          />
          Fragile Item (Handle with Care)
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
        <button type="submit" className="save-button">
          {shipment ? 'Update' : 'Create'} Shipment
        </button>
      </div>
    </form>
  );
};

export default ShipmentForm;