import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaGraduationCap, FaBook, FaUsers, FaLaptopCode, FaChartLine } from 'react-icons/fa';

function Home() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">CampusConnect</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/community">Community</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Learn Without Limits</h1>
          <p className="hero-subtitle">Start, switch, or advance your career with thousands of courses from expert instructors.</p>
          <div className="search-bar">
            <input type="text" placeholder="What do you want to learn?" />
            <button className="search-button">Search</button>
          </div>
        </div>
      </section>

      {/* Feature Navigation */}
      <section className="feature-navigation">
        <div className="feature-list">
          <Link to="/courses" className="feature-card">
            <FaBook className="feature-icon" />
            <h3>Courses</h3>
            <p>Explore our wide range of courses</p>
          </Link>
          <Link to="/community" className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Community</h3>
            <p>Connect with fellow learners</p>
          </Link>
          <Link to="/learning-path" className="feature-card">
            <FaGraduationCap className="feature-icon" />
            <h3>Learning Path</h3>
            <p>Follow structured learning paths</p>
          </Link>
          <Link to="/career" className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3>Career Growth</h3>
            <p>Advance your career with us</p>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Popular Categories</h2>
        <div className="category-list">
          <div className="category-card zoom-in">
            <h3>Web Development</h3>
            <p>Learn modern web technologies</p>
          </div>
          <div className="category-card zoom-in">
            <h3>Data Science</h3>
            <p>Master data analysis and ML</p>
          </div>
          <div className="category-card zoom-in">
            <h3>Mobile Development</h3>
            <p>Build iOS and Android apps</p>
          </div>
          <div className="category-card zoom-in">
            <h3>Cloud Computing</h3>
            <p>Explore cloud platforms</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="featured-courses">
        <h2>Featured Courses</h2>
        <div className="course-list">
          <div className="course-card pop-up">
            <img src="https://via.placeholder.com/250x150" alt="Course" />
            <h3>Full Stack Development</h3>
            <p>Master modern web development</p>
          </div>
          <div className="course-card pop-up">
            <img src="https://via.placeholder.com/250x150" alt="Course" />
            <h3>Machine Learning</h3>
            <p>Learn AI and ML fundamentals</p>
          </div>
          <div className="course-card pop-up">
            <img src="https://via.placeholder.com/250x150" alt="Course" />
            <h3>Cloud Architecture</h3>
            <p>Design scalable cloud solutions</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Student Success Stories</h2>
        <div className="testimonial-card">
          <img src="https://via.placeholder.com/80" alt="Student" />
          <h3>John Doe</h3>
          <p>"CampusConnect helped me land my dream job in tech!"</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
        <div className="footer-socials">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-linkedin"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </footer>
    </div>
  );
}

export default Home; 