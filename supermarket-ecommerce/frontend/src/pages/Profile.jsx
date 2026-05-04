import { useState, useEffect } from 'react';
import { authAPI, productAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: { street: '', city: '', state: '', zipCode: '', country: 'USA' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        confirmPassword: '',
        address: user.address || { street: '', city: '', state: '', zipCode: '', country: 'USA' }
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const { data } = await authAPI.updateProfile(updateData);
      login(data);
      setSuccess('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Shipping Address</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Street</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => setFormData({ 
                  address: { ...formData.address, street: e.target.value } 
                })}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => setFormData({ 
                  address: { ...formData.address, city: e.target.value } 
                })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => setFormData({ 
                  address: { ...formData.address, state: e.target.value } 
                })}
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => setFormData({ 
                  address: { ...formData.address, zipCode: e.target.value } 
                })}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Change Password</h2>
          <div className="form-row">
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="update-btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
