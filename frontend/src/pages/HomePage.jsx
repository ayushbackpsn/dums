import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { PackageSearch, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const HomePage = ({ addToCart, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || product.category === category;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'brand':
        comparison = a.brand.localeCompare(b.brand);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="animate-fade-in" style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading amazing shoes...</div>
    </div>
  );

  if (error) return <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="glass-card" style={{ padding: '4rem 3rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', maxWidth: '600px' }}>
            STEP INTO THE <br />
            <span style={{ color: 'var(--primary)' }}>FUTURE</span> OF FOOTWEAR
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2rem' }}>
            Discover our premium collection of organic, high-performance sneakers designed for modern life.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary">Shop Now</button>
            <button className="btn btn-secondary">New Arrivals</button>
          </div>
        </div>
        {/* Background 3D Float Elements */}
        <div className="float-3d" style={{ position: 'absolute', right: '5%', top: '10%', opacity: 0.1, pointerEvents: 'none' }}>
          <PackageSearch size={200} />
        </div>
      </section>

      {/* Filter Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`btn ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCategory(cat)}
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderRadius: '20px' }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowFilters(!showFilters)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowUpDown size={18} /> Sort
            </button>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '0.5rem',
                padding: '0.5rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--card-bg)',
                color: 'var(--text)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="brand">Brand</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Advanced Filters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                Price Range: ${priceRange.min} - ${priceRange.max}
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                  style={{ 
                    width: '80px', 
                    padding: '0.5rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px',
                    background: 'var(--card-bg)',
                    color: 'var(--text)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setPriceRange({ min: 0, max: 1000 });
                  setCategory('All');
                  setSortBy('name');
                  setSortOrder('asc');
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <PackageSearch size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No shoes found matching your search.</h3>
          <p style={{ marginTop: '1rem' }}>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="product-grid">
          {sortedProducts.map(product => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
