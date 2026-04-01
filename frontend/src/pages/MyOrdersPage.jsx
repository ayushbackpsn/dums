import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Calendar, DollarSign, MapPin, CreditCard, ChevronRight, ArrowLeft, Filter, Search, Eye, Truck, CheckCircle, Clock } from 'lucide-react';

const MyOrdersPage = ({ user }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#22c55e';
      case 'processing':
        return '#3b82f6';
      case 'shipped':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'processing':
        return <Clock size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'pending':
        return <Package size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderItems?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animate-fade-in" style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/profile')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={20} /> Back to Profile
          </button>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>My <span style={{ color: 'var(--primary)' }}>Orders</span></h1>
        </div>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--card-bg)',
                  color: 'var(--text)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: '20px' }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>
          <h3>Error loading orders</h3>
          <p>{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Package size={64} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            {searchTerm || statusFilter !== 'all' ? 'No matching orders found' : 'No orders yet'}
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Start shopping to see your orders here'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredOrders.map(order => (
            <div key={order._id} className="glass-card" style={{ padding: '1.5rem' }}>
              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Order ID</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>#{order._id.slice(-8).toUpperCase()}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Status</div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    padding: '0.25rem 0.75rem',
                    background: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status),
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    {getStatusIcon(order.status)}
                    {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>
                    ${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? 'Item' : 'Items'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.orderItems?.slice(0, 2).map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        background: 'rgba(99, 102, 241, 0.05)', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <img 
                          src={item.image} 
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          Qty: {item.qty} × ${item.price}
                        </div>
                      </div>
                      <div style={{ fontWeight: '600' }}>
                        ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  {(order.orderItems?.length || 0) > 2 && (
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      +{(order.orderItems?.length || 0) - 2} more items
                    </div>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Calendar size={14} />
                    {formatDate(order.createdAt)}
                  </div>
                  {order.shippingAddress && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} />
                      {order.shippingAddress.city}, {order.shippingAddress.country}
                    </div>
                  )}
                </div>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(order)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Eye size={16} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="glass-card" style={{ 
            maxWidth: '600px', 
            width: '100%', 
            maxHeight: '80vh', 
            overflow: 'auto',
            padding: '2rem',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedOrder(null)}
              style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: 'none', 
                border: 'none', 
                fontSize: '1.5rem', 
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              ×
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              Order Details - #{selectedOrder._id.slice(-8).toUpperCase()}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Status and Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Status</div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    padding: '0.5rem 1rem',
                    background: `${getStatusColor(selectedOrder.status)}20`,
                    color: getStatusColor(selectedOrder.status),
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    width: 'fit-content'
                  }}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status ? selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1) : 'Pending'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Order Date</div>
                  <div style={{ fontWeight: '600' }}>{formatDate(selectedOrder.createdAt)}</div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Items</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedOrder.orderItems?.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px' }}>
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: 'rgba(99, 102, 241, 0.05)', 
                        borderRadius: '8px', 
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <img 
                          src={item.image} 
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          Quantity: {item.qty} × ${item.price}
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                        ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Price Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
                    <span>${selectedOrder.itemsPrice ? selectedOrder.itemsPrice.toFixed(2) : '0.00'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                    <span>{selectedOrder.shippingPrice === 0 ? 'FREE' : `$${selectedOrder.shippingPrice ? selectedOrder.shippingPrice.toFixed(2) : '0.00'}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tax</span>
                    <span>${selectedOrder.taxPrice ? selectedOrder.taxPrice.toFixed(2) : '0.00'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontWeight: '700', fontSize: '1.1rem' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>${selectedOrder.totalPrice ? selectedOrder.totalPrice.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Shipping Address</h3>
                  <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px' }}>
                    <div>{selectedOrder.shippingAddress.address}</div>
                    <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</div>
                    <div>{selectedOrder.shippingAddress.country}</div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Payment Method</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', background: 'var(--card-bg)', borderRadius: '8px' }}>
                  <CreditCard size={18} style={{ color: 'var(--primary)' }} />
                  <span>{selectedOrder.paymentMethod || 'Credit Card'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
