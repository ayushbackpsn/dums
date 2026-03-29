import React from 'react';
import { MapPin, Phone, Clock, Navigation, Search, Star } from 'lucide-react';

const LocationPage = () => {
  const stores = [
    {
      id: 1,
      name: "Glaze Premium Store - Downtown",
      address: "123 Sneaker Street, Fashion District",
      phone: "+1 (555) 123-4567",
      hours: "9:00 AM - 9:00 PM",
      distance: "2.5 km",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1590608897129-79da98d15969?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Glaze Concept Store - Westside",
      address: "456 Urban Avenue, West Mall",
      phone: "+1 (555) 987-6543",
      hours: "10:00 AM - 10:00 PM",
      distance: "5.8 km",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Find Our <span style={{ color: 'var(--primary)' }}>Stores</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Visit us to experience the collection in person</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2.5rem', height: '70vh' }}>
        {/* Left Panel: Store List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '1rem' }}>
          <div className="glass" style={{ borderRadius: '16px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Search city or zip..." style={{ border: 'none', background: 'transparent', width: '100%', padding: '0.75rem', color: 'var(--text)', outline: 'none' }} />
          </div>

          {stores.map(store => (
            <div key={store.id} className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <img src={store.image} alt={store.name} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>{store.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600' }}>
                    <Star size={14} fill="var(--primary)" />
                    <span>{store.rating} ({store.distance})</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}><MapPin size={16} /> {store.address}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}><Phone size={16} /> {store.phone}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}><Clock size={16} /> {store.hours}</div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}>
                <Navigation size={18} /> Get Directions
              </button>
            </div>
          ))}
        </div>

        {/* Right Panel: Simulated Map */}
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
          {/* Mock Map Background */}
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundImage: 'url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'grayscale(0.5) contrast(0.8) brightness(0.9)',
            opacity: 0.6
          }}></div>

          {/* Map Overlay Grid */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'radial-gradient(circle, transparent 20%, var(--bg) 150%)',
            pointerEvents: 'none'
          }}></div>

          {/* Store Markers */}
          <div className="float-3d" style={{ position: 'absolute', top: '35%', left: '45%', cursor: 'pointer' }}>
            <div style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '50% 50% 50% 0', 
              transform: 'rotate(-45deg)',
              boxShadow: '0 5px 15px rgba(99, 102, 241, 0.5)',
              border: '2px solid white'
            }}>
              <MapPin size={24} style={{ transform: 'rotate(45deg)' }} />
            </div>
          </div>

          <div className="float-3d" style={{ position: 'absolute', top: '60%', left: '70%', cursor: 'pointer', animationDelay: '-2s' }}>
            <div style={{ 
              background: 'var(--secondary)', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '50% 50% 50% 0', 
              transform: 'rotate(-45deg)',
              boxShadow: '0 5px 15px rgba(236, 72, 153, 0.5)',
              border: '2px solid white'
            }}>
              <MapPin size={24} style={{ transform: 'rotate(45deg)' }} />
            </div>
          </div>

          {/* Map Controls */}
          <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="glass" style={{ width: '45px', height: '45px', borderRadius: '12px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)' }}>+</button>
            <button className="glass" style={{ width: '45px', height: '45px', borderRadius: '12px', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)' }}>-</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
