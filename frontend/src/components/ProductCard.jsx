import React from 'react';
import { ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react';

const ProductCard = ({ product, addToCart }) => {
  const handleAdd = (e) => {
    e.preventDefault();
    console.log('Button clicked for product:', product.name);
    if (addToCart) {
      addToCart(product);
    } else {
      console.warn('addToCart function is missing!');
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
      {/* Product Image Stage */}
      <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.05)' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="float-3d"
          style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s ease', cursor: 'pointer' }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.15) rotate(-5deg)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0)'}
        />
        <button 
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--card-bg)', border: 'none', padding: '0.4rem', borderRadius: '50%', color: 'var(--secondary)', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Info Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{product.brand}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
            <Star size={14} fill="var(--accent)" color="var(--accent)" />
            <span style={{ fontWeight: '600' }}>4.8</span>
          </div>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.2' }}>{product.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.description}
        </p>
      </div>

      {/* Action Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)' }}>${product.price}</span>
        <button 
          className="btn btn-primary" 
          onClick={handleAdd}
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderRadius: '14px' }}
        >
          <ShoppingCart size={18} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
