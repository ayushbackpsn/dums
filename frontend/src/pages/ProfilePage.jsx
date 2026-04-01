import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Shield, LogOut, Package, CreditCard } from 'lucide-react';

const ProfilePage = ({ user, setUser, logout }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get('/api/users/profile', config);
        console.log('Profile data received:', data); // Debug log
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          country: data.country || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err); // Debug log
        setError(err.response?.data?.message || 'Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put('/api/users/profile', profileData, config);
      
      // Update user data in localStorage and state
      const updatedUser = { ...user, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setSaving(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || ''
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animate-fade-in" style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>My <span style={{ color: 'var(--primary)' }}>Profile</span></h1>
        {!isEditing && (
          <button 
            className="btn btn-secondary"
            onClick={() => setIsEditing(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Edit2 size={18} /> Edit Profile
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile Summary Card */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem',
              fontWeight: '800',
              color: 'white'
            }}>
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {profileData.name}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {profileData.email}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                background: 'rgba(99, 102, 241, 0.1)', 
                color: 'var(--primary)', 
                borderRadius: '20px', 
                fontSize: '0.85rem', 
                fontWeight: '600' 
              }}>
                Premium Member
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/orders')}
                style={{ justifyContent: 'flex-start', gap: '0.75rem' }}
              >
                <Package size={18} /> My Orders
              </button>
              <button 
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', gap: '0.75rem' }}
              >
                <CreditCard size={18} /> Payment Methods
              </button>
              <button 
                className="btn btn-secondary"
                onClick={handleLogout}
                style={{ justifyContent: 'flex-start', gap: '0.75rem', color: '#ef4444' }}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Personal Information */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={24} color="var(--primary)" /> Personal Information
              </h3>
              {isEditing && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div style={{ 
                marginBottom: '1.5rem', 
                padding: '1rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid #ef4444', 
                borderRadius: '12px',
                color: '#ef4444',
                fontWeight: '600'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ 
                marginBottom: '1.5rem', 
                padding: '1rem', 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid var(--success)', 
                borderRadius: '12px',
                color: 'var(--success)',
                fontWeight: '600'
              }}>
                {success}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    background: isEditing ? 'var(--card-bg)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    background: isEditing ? 'var(--card-bg)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    background: isEditing ? 'var(--card-bg)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={24} color="var(--primary)" /> Address Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    background: isEditing ? 'var(--card-bg)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    background: isEditing ? 'var(--card-bg)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={profileData.postalCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    background: isEditing ? 'var(--card-bg)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    background: isEditing ? 'var(--card-bg)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={24} color="var(--primary)" /> Account Security
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Password</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Last changed 30 days ago</div>
                </div>
                <button className="btn btn-secondary">Change Password</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Add an extra layer of security</div>
                </div>
                <button className="btn btn-secondary">Enable</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
