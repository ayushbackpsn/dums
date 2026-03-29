import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { PackageSearch, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const HomePage = ({ addToCart, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
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
    return matchesSearch && matchesCategory;
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
          <button className="btn btn-secondary"><SlidersHorizontal size={18} /> Filters</button>
          <button className="btn btn-secondary"><ArrowUpDown size={18} /> Sort</button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <PackageSearch size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No shoes found matching your search.</h3>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
