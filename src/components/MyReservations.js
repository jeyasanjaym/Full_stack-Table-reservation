import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, X, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import './MyReservations.css';
import { reservationsAPI } from '../utils/api';

const MyReservations = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Load reservations from backend
    const loadReservations = async () => {
      try {
        const result = await reservationsAPI.getMyReservations();
        if (result.success) {
          // Map API shape to UI shape
          const list = result.data.reservations.map(r => ({
            id: r._id,
            restaurant: r.restaurantName,
            restaurantId: r.restaurantId,
            date: r.date,
            time: r.time,
            partySize: r.partySize,
            status: r.status,
            address: r.address,
            phone: r.phone,
            createdAt: r.createdAt
          }));
          // Sort by date
          list.sort((a, b) => new Date(a.date) - new Date(b.date));
          setReservations(list);
        } else {
          toast.error(result.error);
        }
      } catch (e) {
        toast.error('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [user]);

  const clearAll = async () => {
    if (!window.confirm('Clear all your reservations?')) return;
    setClearing(true);
    try {
      const res = await reservationsAPI.clearMine();
      if (res.success) {
        toast.success('All reservations cleared');
        // reload
        const refreshed = await reservationsAPI.getMyReservations();
        if (refreshed.success) setReservations([]);
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      toast.error('Failed to clear');
    } finally {
      setClearing(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      // Call backend to cancel
      const result = await reservationsAPI.update(reservationId, { status: 'cancelled' });
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      // Update UI state
      const updatedReservations = reservations.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: 'cancelled' }
          : reservation
      );
      setReservations(updatedReservations);

      toast.success('Reservation cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel reservation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) >= new Date().setHours(0, 0, 0, 0);
  };

  if (!user) {
    return (
      <div className="my-reservations">
        <div className="container">
          <div className="auth-required">
            <h2>Please Login</h2>
            <p>You need to be logged in to view your reservations.</p>
            <a href="/login" className="login-button">Login</a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-reservations">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading your reservations...</p>
          </div>
        </div>
      </div>
    );
  }

  const upcomingReservations = reservations.filter(r => isUpcoming(r.date) && r.status !== 'cancelled');
  const pastReservations = reservations.filter(r => !isUpcoming(r.date) || r.status === 'cancelled');

  return (
    <div className="my-reservations">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>My Reservations</h1>
            <p>Manage your dining reservations</p>
          </div>
          {reservations.length > 0 && (
            <button className="cancel-button" onClick={clearAll} disabled={clearing}>
              {clearing ? 'Clearing...' : 'Clear My Reservations'}
            </button>
          )}
        </div>

        {reservations.length === 0 ? (
          <div className="no-reservations">
            <Calendar size={64} className="no-reservations-icon" />
            <h3>No Reservations Yet</h3>
            <p>You haven't made any reservations yet. Start exploring restaurants to book your first table!</p>
            <a href="/restaurants" className="browse-button">Browse Restaurants</a>
          </div>
        ) : (
          <div className="reservations-sections">
            {upcomingReservations.length > 0 && (
              <section className="reservations-section">
                <h2>Upcoming Reservations</h2>
                <div className="reservations-grid">
                  {upcomingReservations.map(reservation => (
                    <div key={reservation.id} className="reservation-card">
                      <div className="reservation-header">
                        <h3 className="restaurant-name">{reservation.restaurant}</h3>
                        <div className="status-badge" style={{ backgroundColor: getStatusColor(reservation.status) }}>
                          {reservation.status}
                        </div>
                      </div>

                      <div className="reservation-details">
                        <div className="detail-row">
                          <Calendar className="detail-icon" />
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        <div className="detail-row">
                          <Clock className="detail-icon" />
                          <span>{reservation.time}</span>
                        </div>
                        <div className="detail-row">
                          <Users className="detail-icon" />
                          <span>{reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</span>
                        </div>
                        {reservation.address && (
                          <div className="detail-row">
                            <MapPin className="detail-icon" />
                            <span>{reservation.address}</span>
                          </div>
                        )}
                        {reservation.phone && (
                          <div className="detail-row">
                            <Phone className="detail-icon" />
                            <span>{reservation.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="reservation-actions">
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="cancel-button"
                          disabled={reservation.status === 'cancelled'}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                        <a
                          href={`/restaurant/${reservation.restaurantId || 1}`}
                          className="view-restaurant-button"
                        >
                          View Restaurant
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {pastReservations.length > 0 && (
              <section className="reservations-section">
                <h2>Past Reservations</h2>
                <div className="reservations-grid">
                  {pastReservations.map(reservation => (
                    <div key={reservation.id} className="reservation-card past">
                      <div className="reservation-header">
                        <h3 className="restaurant-name">{reservation.restaurant}</h3>
                        <div className="status-badge" style={{ backgroundColor: getStatusColor(reservation.status) }}>
                          {reservation.status}
                        </div>
                      </div>

                      <div className="reservation-details">
                        <div className="detail-row">
                          <Calendar className="detail-icon" />
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        <div className="detail-row">
                          <Clock className="detail-icon" />
                          <span>{reservation.time}</span>
                        </div>
                        <div className="detail-row">
                          <Users className="detail-icon" />
                          <span>{reservation.partySize} {reservation.partySize === 1 ? 'person' : 'people'}</span>
                        </div>
                      </div>

                      <div className="reservation-actions">
                        <a
                          href={`/restaurant/${reservation.restaurantId || 1}`}
                          className="view-restaurant-button"
                        >
                          Book Again
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
