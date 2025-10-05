import React, { useState, useEffect } from 'react';
import { Users, Calendar, Eye, Trash2, Search, Filter, PlusCircle, Building2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { userAPI, hotelsAPI, adminAPI } from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    emailUsers: 0,
    googleUsers: 0,
    todayRegistrations: 0
  });
  const [hotels, setHotels] = useState([]);
  const [hotelForm, setHotelForm] = useState({
    name: '', city: '', address: '', phone: '', description: '', cuisine: '', priceRange: '$$', openTime: '11:00 AM', closeTime: '10:00 PM', capacity: 50, image: '',
    locationType: 'open', district: '', bestFood: '', mealType: 'any', lat: '', lng: ''
  });
  const [reservationsModal, setReservationsModal] = useState({ open: false, hotel: null, list: [], loading: false });

  useEffect(() => {
    fetchUsers();
    fetchHotels();
    fetchSummary();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await userAPI.getAllUsers();
      
      if (result.success) {
        const userData = result.data.users || [];
        setUsers(userData);
        calculateStats(userData);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const result = await hotelsAPI.list();
      if (result.success) {
        setHotels(result.data.hotels || []);
      }
    } catch (e) {
      // ignore silently
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await adminAPI.summary();
      if (res.success) {
        setStats((prev) => ({
          ...prev,
          totalUsers: res.data.users,
          todayRegistrations: res.data.todayLogins, // display today logins in the second card
        }));
      }
    } catch (e) {}
  };

  const handleHotelFormChange = (e) => {
    const { name, value } = e.target;
    setHotelForm((f) => ({ ...f, [name]: value }));
  };

  const createHotel = async (e) => {
    e.preventDefault();
    try {
      const res = await hotelsAPI.create(hotelForm);
      if (res.success) {
        toast.success('Hotel added');
        setHotelForm({ name: '', city: '', address: '', phone: '', description: '', cuisine: '', priceRange: '$$', openTime: '11:00 AM', closeTime: '10:00 PM', capacity: 50, image: '', locationType: 'open', district: '', bestFood: '', mealType: 'any', lat: '', lng: '' });
        fetchHotels();
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      toast.error('Failed to add hotel');
    }
  };

  const deleteHotel = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try {
      const res = await hotelsAPI.remove(id);
      if (res.success) {
        toast.success('Hotel deleted');
        setHotels((h) => h.filter(x => x._id !== id));
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const openReservations = async (hotel) => {
    setReservationsModal({ open: true, hotel, list: [], loading: true });
    try {
      const res = await adminAPI.hotelReservations(hotel._id);
      if (res.success) {
        setReservationsModal({ open: true, hotel, list: res.data.reservations || [], loading: false });
      } else {
        setReservationsModal({ open: true, hotel, list: [], loading: false });
        toast.error(res.error);
      }
    } catch (e) {
      setReservationsModal({ open: true, hotel, list: [], loading: false });
      toast.error('Failed to load reservations');
    }
  };

  const calculateStats = (userData) => {
    const today = new Date().toDateString();
    
    const stats = {
      totalUsers: userData.length,
      emailUsers: userData.filter(user => user.loginMethod === 'email').length,
      googleUsers: userData.filter(user => user.loginMethod === 'google').length,
      todayRegistrations: userData.filter(user => 
        new Date(user.createdAt).toDateString() === today
      ).length
    };
    
    setStats(stats);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);

    const matchesFilter = 
      filterBy === 'all' ||
      (filterBy === 'email' && user.loginMethod === 'email') ||
      (filterBy === 'google' && user.loginMethod === 'google') ||
      (filterBy === 'today' && new Date(user.createdAt).toDateString() === new Date().toDateString());

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and hotels</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Calendar />
          </div>
          <div className="stat-content">
            <h3>{stats.todayRegistrations}</h3>
            <p>Today's Logins</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Eye />
          </div>
          <div className="stat-content">
            <h3>{stats.emailUsers}</h3>
            <p>Email Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Users />
          </div>
          <div className="stat-content">
            <h3>{stats.googleUsers}</h3>
            <p>Google Users</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="admin-controls">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter className="filter-icon" />
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="all">All Users</option>
            <option value="email">Email Users</option>
            <option value="google">Google Users</option>
            <option value="today">Today's Registrations</option>
          </select>
        </div>

        <button onClick={fetchUsers} className="refresh-btn">
          Refresh Data
        </button>
      </div>

      {/* Hotels Management */}
      <div className="hotels-section">
        <div className="section-header">
          <h2><Building2 size={18} /> Manage Hotels</h2>
        </div>

        <form className="hotel-form" onSubmit={createHotel}>
          <div className="form-row">
            <input name="name" value={hotelForm.name} onChange={handleHotelFormChange} placeholder="Hotel name" required />
            <input name="city" value={hotelForm.city} onChange={handleHotelFormChange} placeholder="City" required />
            <select name="priceRange" value={hotelForm.priceRange} onChange={handleHotelFormChange}>
              <option>$</option><option>$$</option><option>$$$</option><option>$$$$</option>
            </select>
          </div>
          <div className="form-row">
            <input name="address" value={hotelForm.address} onChange={handleHotelFormChange} placeholder="Address" />
            <input name="phone" value={hotelForm.phone} onChange={handleHotelFormChange} placeholder="Phone" />
            <input name="cuisine" value={hotelForm.cuisine} onChange={handleHotelFormChange} placeholder="Type/Cuisine" />
          </div>
          <div className="form-row">
            <select name="locationType" value={hotelForm.locationType} onChange={handleHotelFormChange}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="beach">Beach</option>
              <option value="hill">Hill</option>
            </select>
            <input name="district" value={hotelForm.district} onChange={handleHotelFormChange} placeholder="District" />
            <input name="bestFood" value={hotelForm.bestFood} onChange={handleHotelFormChange} placeholder="Best Food" />
            <select name="mealType" value={hotelForm.mealType} onChange={handleHotelFormChange}>
              <option value="any">Any</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <div className="form-row">
            <input name="openTime" value={hotelForm.openTime} onChange={handleHotelFormChange} placeholder="Open Time" />
            <input name="closeTime" value={hotelForm.closeTime} onChange={handleHotelFormChange} placeholder="Close Time" />
            <input name="capacity" type="number" value={hotelForm.capacity} onChange={handleHotelFormChange} placeholder="Capacity" />
          </div>
          <div className="form-row">
            <input name="lat" value={hotelForm.lat} onChange={handleHotelFormChange} placeholder="Latitude (e.g., 11.0168)" />
            <input name="lng" value={hotelForm.lng} onChange={handleHotelFormChange} placeholder="Longitude (e.g., 76.9558)" />
          </div>
          <div className="form-row">
            <input name="image" value={hotelForm.image} onChange={handleHotelFormChange} placeholder="Image URL (optional)" />
          </div>
          <div className="form-row">
            <textarea name="description" value={hotelForm.description} onChange={handleHotelFormChange} placeholder="Description" />
          </div>
          <button type="submit" className="add-btn"><PlusCircle /> Add Hotel</button>
        </form>

        <div className="hotels-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Type</th>
                <th>Price</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.length ? hotels.map(h => (
                <tr key={h._id}>
                  <td>{h.name}</td>
                  <td>{h.city}</td>
                  <td>{h.cuisine || '-'}</td>
                  <td>{h.priceRange || '$$'}</td>
                  <td>{h.phone || '-'}</td>
                  <td className="actions">
                    <button className="view-btn" onClick={() => openReservations(h)} title="View reservations"><Eye size={16} /></button>
                    <button className="delete-btn" onClick={() => deleteHotel(h._id)} title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="no-data">No hotels yet. Add one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Login Method</th>
              <th>Registration Date</th>
              <th>Last Login</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>
                    <span className={`login-method ${user.loginMethod}`}>
                      {user.loginMethod === 'email' ? 'Email' : 'Google'}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
                  <td>
                    <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No users found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reservations Modal */}
      {reservationsModal.open && (
        <div className="modal-backdrop" onClick={() => setReservationsModal({ open: false, hotel: null, list: [], loading: false })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reservations – {reservationsModal.hotel?.name}</h3>
              <button className="icon-btn" onClick={() => setReservationsModal({ open: false, hotel: null, list: [], loading: false })}><X /></button>
            </div>
            <div className="modal-body">
              {reservationsModal.loading ? (
                <div className="loading"><div className="loading-spinner"></div><p>Loading reservations...</p></div>
              ) : reservationsModal.list.length ? (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Party</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationsModal.list.map(r => (
                      <tr key={r._id}>
                        <td>{r.user?.name || '-'}</td>
                        <td>{r.user?.email || '-'}</td>
                        <td>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                        <td>{r.time}</td>
                        <td>{r.partySize}</td>
                        <td>{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">No reservations yet for this hotel.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="admin-summary">
        <p>
          Showing {filteredUsers.length} of {users.length} users
          {searchTerm && ` matching "${searchTerm}"`}
          {filterBy !== 'all' && ` filtered by ${filterBy}`}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
