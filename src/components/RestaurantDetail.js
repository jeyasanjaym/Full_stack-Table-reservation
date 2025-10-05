import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Users, Calendar, Phone, Mail } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import './RestaurantDetail.css';
import { hotelsAPI, reservationsAPI } from '../utils/api';

const RestaurantDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const resp = await hotelsAPI.detail(id);
        if (resp.success && resp.data.hotel) {
          const h = resp.data.hotel;
          setRestaurant({
            id: h._id,
            name: h.name,
            cuisine: h.cuisine || 'Restaurant',
            rating: h.rating || 4.6,
            reviews: 100,
            priceRange: h.priceRange || '$$',
            location: h.city || '',
            address: h.address || '',
            phone: h.phone || '',
            email: '',
            openTime: h.openTime || '11:00 AM',
            closeTime: h.closeTime || '10:00 PM',
            capacity: h.capacity || 50,
            description: h.description || '',
            longDescription: h.description || ''
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        // fall back to mock if API fails
      }
      // Fallback mock
      const mock = {
        id: 1,
        name: 'Kongu Parotta Stall',
        cuisine: 'South Indian',
        rating: 4.8,
        reviews: 324,
        priceRange: '$$',
        location: 'Erode District',
        address: 'Erode, Tamil Nadu',
        phone: '+91 98765 43210',
        openTime: '11:00 AM',
        closeTime: '10:00 PM',
        capacity: 80,
        description: 'Famous Kongu style parotta and gravies',
        longDescription: 'Local favorite serving parotta with rich gravies.'
      };
      setRestaurant(mock);
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      generateAvailableSlots();
    }
  }, [selectedDate, partySize]);

  const generateAvailableSlots = () => {
    const slots = [];
    const startHour = 17; // 5 PM
    const endHour = 22; // 10 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        // Mock availability - randomly make some slots unavailable
        const available = Math.random() > 0.3;
        
        slots.push({
          time,
          displayTime,
          available
        });
      }
    }
    
    setAvailableSlots(slots);
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to make a reservation');
      navigate('/login');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    setBookingLoading(true);

    try {
      const payload = {
        hotel: restaurant.id, // backend will link if ObjectId
        restaurantName: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        date: selectedDate,
        time: selectedTime,
        partySize
      };
      const res = await reservationsAPI.create(payload);
      if (res.success) {
        toast.success('Reservation confirmed!');
        navigate('/my-reservations');
      } else {
        toast.error(res.error || 'Booking failed');
      }
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="restaurant-detail">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-detail">
        <div className="error">
          <h2>Restaurant not found</h2>
          <p>The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-detail">
      <div className="restaurant-hero">
        <div className="hero-image">
          <div className="image-placeholder">🍽️</div>
        </div>
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <h1 className="restaurant-name">{restaurant.name}</h1>
              <div className="restaurant-meta">
                <div className="rating">
                  <Star className="star-icon" />
                  <span>{restaurant.rating} ({restaurant.reviews} reviews)</span>
                </div>
                <div className="cuisine">{restaurant.cuisine}</div>
                <div className="price">{restaurant.priceRange}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="restaurant-content">
          <div className="restaurant-info">
            <section className="description-section">
              <h2>About</h2>
              <p className="description">{restaurant.longDescription || restaurant.description}</p>
            </section>

            <section className="details-section">
              <h2>Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <MapPin className="detail-icon" />
                  <div>
                    <strong>Address</strong>
                    <p>{restaurant.address}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Phone className="detail-icon" />
                  <div>
                    <strong>Phone</strong>
                    <p>{restaurant.phone}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock className="detail-icon" />
                  <div>
                    <strong>Hours</strong>
                    <p>{restaurant.openTime} - {restaurant.closeTime}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Users className="detail-icon" />
                  <div>
                    <strong>Capacity</strong>
                    <p>Up to {restaurant.capacity} guests</p>
                  </div>
                </div>
              </div>
            </section>

            {restaurant.amenities && (
              <section className="amenities-section">
                <h2>Amenities</h2>
                <div className="amenities-list">
                  {restaurant.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="booking-panel">
            <div className="booking-card">
              <h2>Make a Reservation</h2>
              
              <div className="booking-form">
                <div className="form-group">
                  <label>Select Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={setSelectedDate}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    dateFormat="MMMM d, yyyy"
                    className="date-picker"
                  />
                </div>

                <div className="form-group">
                  <label>Party Size</label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="party-select"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Available Times</label>
                  <div className="time-slots">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        className={`time-slot ${!slot.available ? 'unavailable' : ''} ${selectedTime === slot.displayTime ? 'selected' : ''}`}
                        onClick={() => slot.available && setSelectedTime(slot.displayTime)}
                        disabled={!slot.available}
                      >
                        {slot.displayTime}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className={`book-button ${bookingLoading ? 'loading' : ''}`}
                  disabled={!selectedTime || bookingLoading}
                >
                  {bookingLoading ? 'Booking...' : 'Reserve Table'}
                </button>

                {!user && (
                  <p className="login-prompt">
                    <a href="/login">Login</a> to make a reservation
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
