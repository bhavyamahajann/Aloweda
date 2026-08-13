import { useState, useEffect } from 'react';
import './BundleManagement.css';

function BundleManagement() {
  const [bundles, setBundles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bundleType: 'percentage',
    rules: {
      discountPercentage: 0,
      fixedDiscount: 0
    },
    minOrderValue: 0,
    active: true
  });

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/bundles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setBundles(data.data);
      }
    } catch (error) {
      console.error('Error fetching bundles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const url = editingBundle 
        ? `${API_URL}/api/bundles/${editingBundle._id}`
        : `${API_URL}/api/bundles`;
      
      const method = editingBundle ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingBundle ? 'Bundle updated!' : 'Bundle created!');
        fetchBundles();
        setShowForm(false);
        setEditingBundle(null);
        resetForm();
      } else {
        alert(data.message || 'Error saving bundle');
      }
    } catch (error) {
      alert('Failed to save bundle');
    }
  };

  const handleEdit = (bundle) => {
    setEditingBundle(bundle);
    setFormData({
      name: bundle.name,
      description: bundle.description,
      bundleType: bundle.bundleType,
      rules: bundle.rules,
      minOrderValue: bundle.minOrderValue,
      active: bundle.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/bundles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Bundle deleted successfully!');
        fetchBundles();
      }
    } catch (error) {
      alert('Failed to delete bundle');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      bundleType: 'percentage',
      rules: {
        discountPercentage: 0,
        fixedDiscount: 0
      },
      minOrderValue: 0,
      active: true
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBundle(null);
    resetForm();
  };

  return (
    <div className="bundle-management">
      <div className="page-header">
        <h1>🎁 Bundle Management</h1>
        <button className="create-btn" onClick={() => setShowForm(true)}>
          + Create New Bundle
        </button>
      </div>

      {/* Bundle List */}
      <div className="bundles-grid">
        {bundles.map(bundle => (
          <div key={bundle._id} className="bundle-admin-card">
            <div className="bundle-status">
              <span className={`status-badge ${bundle.active ? 'active' : 'inactive'}`}>
                {bundle.active ? '● Active' : '○ Inactive'}
              </span>
            </div>

            <h3>{bundle.name}</h3>
            <p className="bundle-desc">{bundle.description}</p>

            <div className="bundle-info">
              <div className="info-item">
                <span className="label">Type:</span>
                <span className="value">{bundle.bundleType}</span>
              </div>

              {bundle.bundleType === 'percentage' && (
                <div className="info-item">
                  <span className="label">Discount:</span>
                  <span className="value discount">{bundle.rules.discountPercentage}% OFF</span>
                </div>
              )}

              {bundle.bundleType === 'fixed' && (
                <div className="info-item">
                  <span className="label">Discount:</span>
                  <span className="value discount">₹{bundle.rules.fixedDiscount} OFF</span>
                </div>
              )}

              <div className="info-item">
                <span className="label">Min Order:</span>
                <span className="value">₹{bundle.minOrderValue}</span>
              </div>

              <div className="info-item">
                <span className="label">Usage:</span>
                <span className="value">{bundle.usageCount || 0} times</span>
              </div>
            </div>

            <div className="bundle-actions">
              <button className="edit-btn" onClick={() => handleEdit(bundle)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(bundle._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {bundles.length === 0 && (
          <div className="no-bundles">
            <p>No bundles created yet. Create your first bundle!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingBundle ? 'Edit Bundle' : 'Create New Bundle'}</h2>
            
            <form onSubmit={handleSubmit} className="bundle-form">
              <div className="form-group">
                <label>Bundle Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Summer Care Bundle"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the bundle offer"
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bundle Type *</label>
                  <select
                    value={formData.bundleType}
                    onChange={(e) => setFormData({...formData, bundleType: e.target.value})}
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Discount</option>
                    <option value="category">Category Based</option>
                  </select>
                </div>

                {formData.bundleType === 'percentage' && (
                  <div className="form-group">
                    <label>Discount Percentage *</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.rules.discountPercentage}
                      onChange={(e) => setFormData({
                        ...formData, 
                        rules: {...formData.rules, discountPercentage: parseInt(e.target.value)}
                      })}
                      placeholder="e.g., 20"
                      required
                    />
                  </div>
                )}

                {formData.bundleType === 'fixed' && (
                  <div className="form-group">
                    <label>Fixed Discount Amount *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.rules.fixedDiscount}
                      onChange={(e) => setFormData({
                        ...formData, 
                        rules: {...formData.rules, fixedDiscount: parseInt(e.target.value)}
                      })}
                      placeholder="e.g., 200"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Minimum Order Value</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({...formData, minOrderValue: parseInt(e.target.value)})}
                  placeholder="e.g., 500"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  />
                  <span>Active (visible to customers)</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingBundle ? 'Update Bundle' : 'Create Bundle'}
                </button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BundleManagement;
