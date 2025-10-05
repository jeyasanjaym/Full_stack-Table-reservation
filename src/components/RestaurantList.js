import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, Users, Search, Filter } from 'lucide-react';
import './RestaurantList.css';
import { hotelsAPI } from '../utils/api';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [loading, setLoading] = useState(true);

  // Load hotels from backend (fallback to mock)
  useEffect(() => {
    const mockRestaurants = [
      {
        id: 1,
        name: "Kongu Parotta Stall",
        cuisine: "South Indian",
        rating: 4.8,
        reviews: 324,
        priceRange: "$$",
        location: "Erode District",
        image: "parotta-stall.jpg",
        openTime: "11:00 AM",
        closeTime: "10:00 PM",
        capacity: 80,
        description: "Famous Kongu style parotta and gravies"
      },
      {
        id: 2,
        name: "Maaman Biriyani",
        cuisine: "Biriyani",
        rating: 4.7,
        reviews: 256,
        priceRange: "$$$",
        location: "Coimbatore",
        image: "biriyani.jpg",
        openTime: "12:00 PM",
        closeTime: "11:00 PM",
        capacity: 60,
        description: "Signature Coimbatore style biriyani"
      },
      {
        id: 3,
        name: "Maharaja Restaurant",
        cuisine: "North Indian",
        rating: 4.6,
        reviews: 210,
        priceRange: "$$$",
        location: "Tiruppur",
        image: "north-indian.jpg",
        openTime: "12:00 PM",
        closeTime: "10:30 PM",
        capacity: 70,
        description: "Royal thali and tandoor specials"
      },
      {
        id: 4,
        name: "AJS Parotta Stall",
        cuisine: "South Indian",
        rating: 4.5,
        reviews: 380,
        priceRange: "$",
        location: "Chennai",
        image: "parotta.jpg",
        openTime: "6:00 PM",
        closeTime: "12:00 AM",
        capacity: 90,
        description: "Crispy parotta, salna and street style sides"
      },
      {
        id: 5,
        name: "Madurai Bun Parotta",
        cuisine: "Madurai Special",
        rating: 4.7,
        reviews: 310,
        priceRange: "$$",
        location: "Madurai",
        image: "madurai-parotta.jpg",
        openTime: "6:00 PM",
        closeTime: "11:00 PM",
        capacity: 100,
        description: "Authentic Madurai bun parotta and kari dosa"
      },
      {
        id: 6,
        name: "Kathirvel Kadai",
        cuisine: "South Indian",
        rating: 4.6,
        reviews: 220,
        priceRange: "$",
        location: "Karur",
        image: "tiffin-shop.jpg",
        openTime: "7:00 AM",
        closeTime: "10:00 PM",
        capacity: 60,
        description: "Popular local tiffin and meals shop"
      }
    ];

    const load = async () => {
      try {
        const result = await hotelsAPI.list();
        if (result.success && result.data.hotels.length > 0) {
          const mapped = result.data.hotels.map((h, idx) => ({
            id: h._id,
            name: h.name,
            cuisine: h.cuisine || 'Restaurant',
            rating: h.rating || 4.6,
            reviews: 100,
            priceRange: h.priceRange || '$$',
            location: h.city || '',
            image: h.image || 'restaurant.jpg',
            openTime: h.openTime || '11:00 AM',
            closeTime: h.closeTime || '10:00 PM',
            capacity: h.capacity || 50,
            description: h.description || ''
          }));
          setRestaurants(mapped);
          setFilteredRestaurants(mapped);
        } else {
          setRestaurants(mockRestaurants);
          setFilteredRestaurants(mockRestaurants);
        }
      } catch (e) {
        setRestaurants(mockRestaurants);
        setFilteredRestaurants(mockRestaurants);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    let filtered = restaurants;

    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCuisine) {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }

    if (priceRange) {
      filtered = filtered.filter(restaurant => restaurant.priceRange === priceRange);
    }

    setFilteredRestaurants(filtered);
  }, [searchTerm, selectedCuisine, priceRange, restaurants]);

  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
  const priceRanges = [...new Set(restaurants.map(r => r.priceRange))];

  if (loading) {
    return (
      <div className="restaurant-list">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-list">
      <div className="container">
        <div className="page-header">
          <h1>Discover Restaurants</h1>
          <p>Find the perfect dining experience for any occasion</p>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search restaurants, cuisine, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <Filter className="filter-icon" />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="filter-select"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="filter-select"
              >
                <option value="">All Prices</option>
                {priceRanges.map(price => (
                  <option key={price} value={price}>{price}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="results-info">
          <p>{filteredRestaurants.length} restaurants found</p>
        </div>

        <div className="restaurants-grid">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant.id} className="restaurant-card">
              <div className="restaurant-image">
                <div className="image-placeholder">
                  🍽️
                </div>
                <div className="rating-badge">
                  <Star className="star-icon" />
                  {restaurant.rating}
                </div>
              </div>

              <div className="restaurant-info">
                <div className="restaurant-header">
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <span className="price-range">{restaurant.priceRange}</span>
                </div>

                <p className="restaurant-description">{restaurant.description}</p>

                <div className="restaurant-details">
                  <div className="detail-item">
                    <span className="cuisine-tag">{restaurant.cuisine}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>{restaurant.openTime} - {restaurant.closeTime}</span>
                  </div>
                  <div className="detail-item">
                    <Users size={16} />
                    <span>Up to {restaurant.capacity} guests</span>
                  </div>
                </div>

                <div className="restaurant-footer">
                  <div className="reviews">
                    <Star className="star-icon" />
                    <span>{restaurant.rating} ({restaurant.reviews} reviews)</span>
                  </div>
                  <Link 
                    to={`/restaurant/${restaurant.id}`} 
                    className="book-button"
                  >
                    View & Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="no-results">
            <h3>No restaurants found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
