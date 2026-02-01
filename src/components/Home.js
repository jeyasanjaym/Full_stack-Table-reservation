import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Star } from 'lucide-react';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <Calendar size={48} />,
      title: 'Easy Booking',
      description: 'Book your table in just a few clicks with our intuitive interface'
    },
    {
      icon: <Clock size={48} />,
      title: 'Real-time Avsay ailability',
      description: 'See available time slots instantly and get immediate confirmation'
    },
    {
      icon: <Users size={48} />,
      title: 'Group Reservations',
      description: 'Perfect for date nights, family dinners, or business meetings'
    },
    {
      icon: <Star size={48} />,
      title: 'Top Restaurants',
      description: 'Access to the best restaurants in your city with verified reviews'
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Reserve Your Perfect
            <span className="highlight"> Dining Experience</span>
          </h1>
          <p className="hero-description">
            Discover and book tables at the finest restaurants in your city. 
            From intimate dinners to large celebrations, we've got you covered.
          </p>
          <div className="hero-actions">
            <Link to="/restaurants" className="cta-button primary">
              Find Restaurants
            </Link>
            <Link to="/register" className="cta-button secondary">
              Join Now
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="restaurant-card-preview">
            <div className="card-image"></div>
            <div className="card-content">
              <h3>Fine Dining Restaurant</h3>
              <p>⭐⭐⭐⭐⭐ 4.8 (324 reviews)</p>
              <button className="preview-button">Book Now</button>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose ReserveTable?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Partner Restaurants</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100K+</div>
              <div className="stat-label">Reservations Made</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Dining?</h2>
          <p>Join thousands of food lovers who trust ReserveTable for their dining reservations</p>
          <Link to="/restaurants" className="cta-button primary large">
            Explore Restaurants
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
