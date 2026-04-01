import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Moon, Sun, MapPin, User, LogOut, Package } from 'lucide-react';

const Navbar = ({ cartCount, searchTerm, setSearchTerm, theme, toggleTheme, user, logout }) => {
  const navigate = useNavigate();

  return (
    <header className="glass animate-fade-in" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      padding: '0.75rem 0',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(var(--card-bg-rgb), 0.8)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: '2rem'
      }}>
        {/* BRAND - LEFT */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
          <Package size={28} color="var(--primary)" />
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            color: 'var(--text)',
            whiteSpace: 'nowrap'
          }}>
            GLAZE
          </span>
        </Link>

        {/* SEARCH - CENTER */}
        <div style={{ position: 'relative', maxWidth: '500px', justifySelf: 'center', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search footwear..." 
            className="input-field" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '3rem', height: '42px', width: '100%', borderRadius: '12px' }}
          />
        </div>

        {/* ACTIONS - RIGHT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
          <Link to="/location" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600', fontSize: '0.9rem' }}>
            <MapPin size={22} />
            <span className="hide-mobile">Stores</span>
          </Link>
          
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '5px' }}>
            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
          </button>

          <Link to="/cart" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', position: 'relative', fontSize: '0.9rem' }}>
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: 'var(--secondary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>{cartCount}</span>
              )}
            </div>
            <span className="hide-mobile">Bag</span>
          </Link>

          {/* AUTH */}
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  style={{ 
                    color: 'var(--text)', 
                    textDecoration: 'none', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    fontWeight: '600', 
                    fontSize: '0.9rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <User size={16} />
                  <span className="hide-mobile">{(user.name || 'User').split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%', width: '36px', height: '36px' }}>
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', borderRadius: '12px', fontSize: '0.9rem' }}>
                <User size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
