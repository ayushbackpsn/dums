import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard, ChevronLeft } from 'lucide-react';

const CartPage = ({ cart, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '50%', color: 'var(--text-muted)' }}>
          <ShoppingBag size={80} strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Your bag is empty</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Looks like you haven't added any premium kicks yet.</p>
        <Link to="/" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800' }}>Your <span style={{ color: 'var(--secondary)' }}>Bag</span></h1>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontWeight: '600', textDecoration: 'none' }}>
          <ChevronLeft size={20} /> Back to Catalog
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '3rem' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cart.map(item => (
            <div key={item._id} className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '120px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', overflow: 'hidden' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{item.name}</h3>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>${item.price}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{item.category} / {item.brand}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--card-bg)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <button onClick={() => updateQuantity(item._id, -1)} style={{ background: 'none', border: 'none', padding: '0.25rem', color: 'var(--text)', cursor: 'pointer' }}><Minus size={16} /></button>
                    <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)} style={{ background: 'none', border: 'none', padding: '0.25rem', color: 'var(--text)', cursor: 'pointer' }}><Plus size={16} /></button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item._id)} 
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: '600' }}
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Side Panel */}
        <div>
          <div className="glass-card" style={{ padding: '2.5rem', position: 'sticky', top: '150px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', fontWeight: '800', fontSize: '1.5rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '16px', justifyContent: 'center' }}
              onClick={() => navigate('/checkout')}
            >
              <CreditCard size={20} /> Proceed to Checkout <ArrowRight size={20} />
            </button>
            
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Free shipping on orders over $100.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
