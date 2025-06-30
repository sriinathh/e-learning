import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaBell, FaGraduationCap, FaCog, FaSignOutAlt, FaChevronDown, FaUsers, FaEnvelope } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { currentUser } = useUser();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setCoursesMenuOpen(false);
  }, [location]);

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleCoursesMenu = () => {
    setCoursesMenuOpen(!coursesMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home">
            <FaGraduationCap className="logo-icon" />
            <span className="logo-text">Campus<span className="logo-highlight">Connect</span></span>
          </Link>
        </div>

        <div className="navbar-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className={`navbar-item ${isActive('/home')}`}>
            <Link to="/home" className="navbar-link">Home</Link>
          </li>
          <li className={`navbar-item courses-dropdown ${isActive('/courses') || isActive('/simple-course') || location.pathname.includes('/udemy-course')}`}>
            <div className="navbar-link courses-toggle" onClick={toggleCoursesMenu}>
              Courses <FaChevronDown className={coursesMenuOpen ? 'rotate' : ''} />
            </div>
            {coursesMenuOpen && (
              <div className="courses-dropdown-menu">
                <Link to="/courses" className="dropdown-item">
                  Regular Courses
                </Link>
                <Link to="/simple-course" className="dropdown-item">
                  Simple Courses
                </Link>
              </div>
            )}
          </li>
          <li className={`navbar-item ${isActive('/placement')}`}>
            <Link to="/placement" className="navbar-link">Placement</Link>
          </li>
          <li className={`navbar-item ${isActive('/materials')}`}>
            <Link to="/materials" className="navbar-link">Resources</Link>
          </li>
          <li className={`navbar-item ${isActive('/notes')}`}>
            <Link to="/notes" className="navbar-link">MegaLearn</Link> 
          </li>

          <li className={`navbar-item ${isActive('/events')}`}>
            <Link to="/events" className="navbar-link">Events</Link>
          </li>
          <li className={`navbar-item ${isActive('/community')}`}>
            <Link to="/community" className="navbar-link">
              <FaUsers className="icon-left" /> Community
            </Link>
          </li>
          
        
          <li className={`navbar-item ${isActive('/campusconnect')}`}>
            <Link to="/campusconnect" className="navbar-link special">CampusAI</Link>
          </li>
        </ul>
         
        
  



        <div className="navbar-actions">
          <button className="action-btn notification-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          
          <div className="user-menu">
            <button className="action-btn user-btn" onClick={toggleUserMenu}>
              <FaUserCircle />
              {currentUser && (
                <span className="username">{currentUser.name}</span>
              )}
            </button>
            
            {userMenuOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <FaUserCircle /> Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <FaCog /> Settings
                </Link>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
