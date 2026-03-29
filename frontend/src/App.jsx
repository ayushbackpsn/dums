import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LocationPage from './pages/LocationPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Initial cart load failed:', e);
      return [];
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('userInfo');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error parsing user info from localStorage', e);
      return null;
    }
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart updated in localStorage:', cart);
  }, [cart]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToCart = (product) => {
    console.log('Attempting to add product:', product);
    
    if (!product || !product._id) {
      console.error('Invalid product or missing _id:', product);
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item._id === product._id);
      if (existing) {
        return prevCart.map(item => 
          item._id === product._id 
            ? { ...item, quantity: (item.quantity || 0) + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item._id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item._id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          cartCount={cart.reduce((acc, item) => acc + (item.quantity || 0), 0)} 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          logout={logout}
        />
        <main className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} searchTerm={searchTerm} />} />
            <Route path="/cart" element={<CartPage cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />
            <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <SignupPage setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/checkout" element={user ? <CheckoutPage cart={cart} setCart={setCart} user={user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
