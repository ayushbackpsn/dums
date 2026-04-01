import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, CreditCard, ArrowLeft, Home, Mail, Phone, MapPin, Download, Share2 } from 'lucide-react';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order data from location state or localStorage
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
      setLoading(false);
    } else {
      // Try to get from localStorage as fallback
      const savedOrder = localStorage.getItem('lastOrder');
      if (savedOrder) {
        setOrderData(JSON.parse(savedOrder));
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [location.state]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  const generateOrderNumber = () => {
    if (orderData?._id) {
      return `ORD-${orderData._id.slice(-8).toUpperCase()}`;
    }
    return `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleDownloadInvoice = () => {
    // Create a simple invoice download
    const invoiceContent = `
ORDER INVOICE
================
Order Number: ${generateOrderNumber()}
Date: ${orderData?.createdAt ? formatDate(orderData.createdAt) : new Date().toLocaleDateString()}
Status: ${orderData?.status || 'Processing'}

SHIPPING ADDRESS
================
${orderData?.shippingAddress?.address || 'N/A'}
${orderData?.shippingAddress?.city || 'N/A'}, ${orderData?.shippingAddress?.postalCode || 'N/A'}
${orderData?.shippingAddress?.country || 'N/A'}

ORDER ITEMS
===========
${orderData?.orderItems?.map(item => 
  `${item.name} - Qty: ${item.qty} × $${item.price} = $${(item.qty * item.price).toFixed(2)}`
).join('\n') || 'No items'}

PAYMENT DETAILS
===============
Payment Method: ${orderData?.paymentMethod || 'Credit Card'}
Items Subtotal: $${orderData?.itemsPrice?.toFixed(2) || '0.00'}
Shipping: ${orderData?.shippingPrice === 0 ? 'FREE' : `$${orderData?.shippingPrice?.toFixed(2) || '0.00'}`}
Tax: $${orderData?.taxPrice?.toFixed(2) || '0.00'}
Total: $${orderData?.totalPrice?.toFixed(2) || '0.00'}

Thank you for your order!
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${generateOrderNumber()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShareOrder = () => {
    const shareText = `I just placed an order at ShoeStore! Order #${generateOrderNumber()} - Total: $${orderData?.totalPrice?.toFixed(2) || '0.00'}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Order Confirmation',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Order details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animate-fade-in" style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Loading order confirmation...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Success Header */}
      <div style={{ textAlign: 'center', padding: '3rem 0', marginBottom: '2rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          padding: '2rem', 
          borderRadius: '50%', 
          background: 'rgba(34, 197, 94, 0.1)', 
          color: '#22c55e', 
          marginBottom: '2rem',
          animation: 'pulse 2s infinite'
        }}>
          <CheckCircle size={80} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--success)' }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Thank you for your purchase
        </p>
        <div style={{ 
          display: 'inline-block', 
          padding: '0.5rem 1.5rem', 
          background: 'var(--card-bg)', 
          border: '1px solid var(--border)', 
          borderRadius: '20px',
          fontWeight: '600',
          fontSize: '1.1rem',
          color: 'var(--primary)'
        }}>
          {generateOrderNumber()}
        </div>
      </div>

      {/* Order Details Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Order Summary */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Package size={24} color="var(--primary)" /> Order Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order Date</span>
              <span style={{ fontWeight: '600' }}>
                {orderData?.createdAt ? formatDate(orderData.createdAt) : new Date().toLocaleDateString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status</span>
              <span style={{ 
                color: '#f59e0b', 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Clock size={16} /> Processing
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Amount</span>
              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>
                ${orderData?.totalPrice?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Truck size={24} color="var(--primary)" /> Shipping Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={16} style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }} />
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Delivery Address</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  {orderData?.shippingAddress?.address || 'N/A'}
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  {orderData?.shippingAddress?.city || 'N/A'}, {orderData?.shippingAddress?.postalCode || 'N/A'}
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  {orderData?.shippingAddress?.country || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={16} style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Estimated Delivery</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  {orderData?.createdAt ? 
                    formatDate(new Date(new Date(orderData.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000)) :
                    '3-5 business days'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem' }}>Order Items</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orderData?.orderItems?.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center', 
              padding: '1rem', 
              background: 'var(--card-bg)', 
              borderRadius: '12px' 
            }}>
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
          )) || (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No order items found
            </div>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CreditCard size={24} color="var(--primary)" /> Payment Details
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Method</span>
            <span style={{ fontWeight: '600' }}>{orderData?.paymentMethod || 'Credit Card'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
            <span>${orderData?.itemsPrice?.toFixed(2) || '0.00'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
            <span>{orderData?.shippingPrice === 0 ? 'FREE' : `$${orderData?.shippingPrice?.toFixed(2) || '0.00'}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tax</span>
            <span>${orderData?.taxPrice?.toFixed(2) || '0.00'}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            paddingTop: '1rem', 
            borderTop: '1px solid var(--border)', 
            fontWeight: '700', 
            fontSize: '1.2rem' 
          }}>
            <span>Total Paid</span>
            <span style={{ color: 'var(--primary)' }}>${orderData?.totalPrice?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Home size={18} /> Continue Shopping
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleDownloadInvoice}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Download size={18} /> Download Invoice
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleShareOrder}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Share2 size={18} /> Share Order
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={18} /> View Profile
        </button>
      </div>

      {/* Customer Support */}
      <div className="glass-card" style={{ padding: '2rem', marginTop: '3rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>Need Help?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Our customer support team is here to help you with any questions about your order.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={18} style={{ color: 'var(--primary)' }} />
            <span>support@shoestore.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={18} style={{ color: 'var(--primary)' }} />
            <span>1-800-SHOES</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
