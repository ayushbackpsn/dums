import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Heart, Package, CheckCircle } from 'lucide-react';

const ProductDetailPage = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart');
      return;
    }

    setIsAdding(true);
    const productWithSize = { ...product, selectedSize, quantity };
    
    if (addToCart) {
      addToCart(productWithSize);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
    
    setTimeout(() => setIsAdding(false), 500);
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="animate-fade-in" style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
          Loading product details...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', margin: '2rem auto', maxWidth: '600px' }}>
        <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-muted)' }}>{product.category}</span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text)' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Product Image Section */}
        <div>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ 
              width: '100%', 
              height: '500px', 
              background: 'rgba(99, 102, 241, 0.05)', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img 
                src={product.image} 
                alt={product.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
              
              {/* Wishlist Button */}
              <button 
                style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  background: 'var(--card-bg)', 
                  border: '1px solid var(--border)', 
                  padding: '0.75rem', 
                  borderRadius: '50%', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <Heart size={20} style={{ color: 'var(--secondary)' }} />
              </button>
            </div>
            
            {/* Thumbnail Gallery */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'rgba(99, 102, 241, 0.05)', 
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: i === 1 ? '2px solid var(--primary)' : '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img 
                    src={product.image} 
                    alt={`${product.name} view ${i}`}
                    style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Basic Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: 'var(--primary)', 
                letterSpacing: '0.05em', 
                textTransform: 'uppercase' 
              }}>
                {product.brand}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={16} fill="var(--accent)" color="var(--accent)" />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>4.8</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>(124 reviews)</span>
              </div>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem' }}>
              {product.name}
            </h1>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {product.description}
            </p>
            
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
              ${product.price}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Select Size</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      border: selectedSize === size ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: selectedSize === size ? 'rgba(99, 102, 241, 0.1)' : 'var(--card-bg)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: selectedSize === size ? '700' : '600',
                      color: selectedSize === size ? 'var(--primary)' : 'var(--text)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>No sizes available</div>
              )}
            </div>
            {selectedSize && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--success)' }}>
                Size {selectedSize} selected
              </p>
            )}
          </div>

          {/* Quantity Selection */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Quantity</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                background: 'var(--card-bg)', 
                padding: '0.5rem', 
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: '0.25rem', 
                    cursor: 'pointer',
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ 
                  fontWeight: '700', 
                  minWidth: '40px', 
                  textAlign: 'center',
                  fontSize: '1.1rem'
                }}>
                  {quantity}
                </span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: '0.25rem', 
                    cursor: 'pointer',
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div>
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || !selectedSize || product.stock === 0}
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                padding: '1.2rem', 
                fontSize: '1.1rem', 
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                opacity: (isAdding || !selectedSize || product.stock === 0) ? 0.6 : 1,
                cursor: (isAdding || !selectedSize || product.stock === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              {isAdding ? (
                <>
                  <div className="animate-spin" style={{ width: '20px', height: '20px', border: '2px solid var(--text)', borderTop: '2px solid transparent', borderRadius: '50%' }}></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </>
              )}
            </button>
            
            {showSuccess && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid var(--success)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--success)',
                fontWeight: '600'
              }}>
                <CheckCircle size={20} />
                Added to cart successfully!
              </div>
            )}
          </div>

          {/* Product Features */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Product Features</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Package size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.95rem' }}>Free shipping on orders over $100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.95rem' }}>30-day return policy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '0.95rem' }}>Authentic products guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
