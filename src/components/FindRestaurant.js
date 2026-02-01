import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Filter, UtensilsCrossed, Sun, Moon, Coffee } from 'lucide-react';
import { hotelsAPI } from '../utils/api';
import './RestaurantList.css';

const FindRestaurant = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState('');
  const [locationType, setLocationType] = useState('');
  const [mealType, setMealType] = useState('');
  // Show results live without submit
  const mapRef = useRef(null);
  const mapElRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await hotelsAPI.list();
        if (res.success) setHotels(res.data.hotels || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current && mapElRef.current && window.L) {
      const L = window.L;
      // Default center (TN approx)
      const center = [11.0168, 76.9558];
      const map = L.map(mapElRef.current).setView(center, 8);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);
      mapRef.current = { map, markers: [] };
    }
  }, []);

  const districts = useMemo(() => Array.from(new Set(hotels.map(h => (h.district || h.city || '').trim()).filter(Boolean))), [hotels]);

  const filtered = useMemo(() => {
    let list = hotels;
    const norm = (v) => (v || '').toString().trim().toLowerCase();
    const d = norm(district);
    const lt = norm(locationType);
    const mt = norm(mealType);
    if (d) list = list.filter(h => norm(h.district) === d || norm(h.city).includes(d));
    if (lt) list = list.filter(h => norm(h.locationType) === lt);
    if (mt) list = list.filter(h => norm(h.mealType) === mt || norm(h.mealType) === 'any');
    return list;
  }, [hotels, district, locationType, mealType]);

  // Update markers when filtered list changes
  useEffect(() => {
    const ref = mapRef.current;
    if (!ref || !window.L) return;
    const L = window.L;
    // Clear existing markers
    if (ref.markers && ref.markers.length) {
      ref.markers.forEach(m => ref.map.removeLayer(m));
      ref.markers = [];
    }
    const withCoords = filtered.filter(h => typeof h.lat === 'number' && typeof h.lng === 'number');
    if (withCoords.length) {
      const group = L.featureGroup();
      withCoords.forEach(h => {
        const marker = L.marker([h.lat, h.lng]);
        marker.bindPopup(`
          <div style="min-width:180px">
            <strong>${h.name}</strong><br/>
            <span>${h.city || h.district || ''}</span><br/>
            <a href="/restaurant/${h._id}" style="display:inline-block;margin-top:6px;color:#2563eb;text-decoration:underline">Reserve</a>
          </div>
        `);
        marker.addTo(ref.map);
        ref.markers.push(marker);
        group.addLayer(marker);
      });
      try {
        ref.map.fitBounds(group.getBounds().pad(0.2));
      } catch {}
    }
  }, [filtered]);

  const onFind = (e) => {
    e.preventDefault();
    // no-op; results are live
  };

  if (loading) {
    return (
      <div className="restaurant-list">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-list">
      <div className="container">
        <div className="page-header">
          <h1>Find Restaurant</h1>
          <p>Answer a few questions to get personalized results</p>
        </div>

        <form className="filters-section" onSubmit={onFind}>
          <div className="filters">
            <div className="filter-group">
              <Filter className="filter-icon" />
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="filter-select">
                <option value="">Select District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <MapPin className="filter-icon" />
              <select value={locationType} onChange={(e) => setLocationType(e.target.value)} className="filter-select">
                <option value="">Preferred Location</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="beach">Beach</option>
                <option value="hill">Hill</option>
              </select>
            </div>

            <div className="filter-group">
              <UtensilsCrossed className="filter-icon" />
              <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="filter-select">
                <option value="">Meal</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <button className="refresh-btn" type="submit">Find</button>
          </div>
        </form>

        {/* Map View */}
        <div style={{ height: '360px', width: '100%', borderRadius: 12, overflow: 'hidden', margin: '16px 0' }}>
          <div id="map" ref={mapElRef} style={{ height: '100%', width: '100%' }} />
        </div>

        <div className="results-info">
          <p>{filtered.length} restaurants found</p>
        </div>

        <div className="restaurants-grid">
          {filtered.map(restaurant => (
            <div key={restaurant._id} className="restaurant-card">
              <div className="restaurant-image">
                <div className="image-placeholder">🍽️</div>
                <div className="rating-badge">{(restaurant.rating || 4.6).toFixed(1)}</div>
              </div>
              <div className="restaurant-info">
                <div className="restaurant-header">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <span className="price-range">{restaurant.priceRange || '$$'}</span>
                </div>
                <p className="restaurant-description">{restaurant.description || ''}</p>
                <div className="restaurant-details">
                  <div className="detail-item"><span className="cuisine-tag">{restaurant.cuisine || 'Restaurant'}</span></div>
                  <div className="detail-item"><MapPin size={16} /><span>{restaurant.city || restaurant.district}</span></div>
                  <div className="detail-item"><Sun size={16} /><span>{restaurant.openTime || '11:00 AM'} - {restaurant.closeTime || '10:00 PM'}</span></div>
                  <div className="detail-item"><Coffee size={16} /><span>{(restaurant.mealType || 'any').toUpperCase()}</span></div>
                </div>
                <a href={`/restaurant/${restaurant._id}`} className="book-button">View & Book</a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="no-results">
            <h3>No restaurants match your choices</h3>
            <p>Try changing your selections</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRestaurant;
