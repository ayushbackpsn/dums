import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

const CheckoutPage = ({ cart, setCart, user }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.map(item => ({
            name: item.name,
            qty: item.quantity,
            image: item.image,
            price: item.price,
            product: item._id
          })),
          shippingAddress: { address, city, postalCode, country },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );

      // Simulate payment delay
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setCart([]);
        localStorage.removeItem('cart');
        
        // Navigate to order confirmation page with order data
        navigate('/order-confirmation', { 
          state: { 
            orderData: {
              _id: data._id,
              ...data,
              createdAt: new Date().toISOString()
            }
          }
        });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div style={{ display: 'inline-flex', padding: '2rem', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', marginBottom: '2rem' }}>
          <CheckCircle2 size={80} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>Your premium footwear is on its way to you.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '3rem' }}>Checkout & <span style={{ color: 'var(--primary)' }}>Payment</span></h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
        {/* Left Column: Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Shipping Section */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Truck size={24} color="var(--primary)" /> Shipping Address
            </h2>
            <form id="shipping-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Street Address</label>
                <input type="text" className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>City</label>
                <input type="text" className="input-field" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Postal Code</label>
                <input type="text" className="input-field" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Country</label>
                <input type="text" className="input-field" value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
            </form>
          </div>

          {/* Payment Section */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CreditCard size={24} color="var(--primary)" /> Payment Method
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label className="glass" style={{ 
                flex: 1, 
                padding: '1.5rem', 
                borderRadius: '16px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                border: paymentMethod === 'PayPal' ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: paymentMethod === 'PayPal' ? 'rgba(99, 102, 241, 0.05)' : 'var(--card-bg)'
              }}>
                <input type="radio" name="payment" value="PayPal" checked={paymentMethod === 'PayPal'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '20px', height: '20px' }} />
                <span>PayPal or Credit Card</span>
              </label>
              <label className="glass" style={{ 
                flex: 1, 
                padding: '1.5rem', 
                borderRadius: '16px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                border: paymentMethod === 'Stripe' ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: paymentMethod === 'Stripe' ? 'rgba(99, 102, 241, 0.05)' : 'var(--card-bg)'
              }}>
                <input type="radio" name="payment" value="Stripe" checked={paymentMethod === 'Stripe'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '20px', height: '20px' }} />
                <span>Stripe</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div>
          <div className="glass-card" style={{ padding: '2.5rem', position: 'sticky', top: '150px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Items Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Estimated Tax</span>
                <span>${taxPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontWeight: '800', fontSize: '1.25rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${totalPrice}</span>
              </div>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '16px' }} 
              onClick={placeOrderHandler}
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? <><Loader2 className="animate-spin" size={20} /> Securing Payment...</> : `Pay $${totalPrice}`}
            </button>

            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.85rem', fontWeight: '600' }}>
              <ShieldCheck size={18} />
              <span>SECURE PAYMENT ENCRYPTED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
