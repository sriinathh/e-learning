import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaBell, FaGraduationCap, FaCog, FaSignOutAlt, FaChevronDown, FaUsers, FaEnvelope, FaComments } from 'react-icons/fa';
import { useSocket } from '../../context/SocketContext';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState('');
  const location = useLocation();
  const { socket } = useSocket();

  // Get user name on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name || user.username || user.email.split('@')[0]);
    }
  }, []);

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

  // Listen for unread messages
  useEffect(() => {
    if (!socket) return;

    const handleUnreadMessages = (counts) => {
      const totalUnread = counts.reduce((total, item) => total + item.count, 0);
      setUnreadCount(totalUnread);
    };

    socket.on('unreadMessages', handleUnreadMessages);

    // Also update unread count when receiving new message
    socket.on('newDirectMessage', (message) => {
      // Only increment if message is not from current user
      if (!message.isCurrentUser) {
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      socket.off('unreadMessages');
      socket.off('newDirectMessage');
    };
  }, [socket]);

  // Reset unread count when visiting messages page
  useEffect(() => {
    if (location.pathname === '/messages') {
      setUnreadCount(0);
    }
  }, [location.pathname]);

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
    localStorage.removeItem('token');
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
          <Link to="/messages" className="action-btn notification-btn messages-btn">
            <FaComments />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </Link>
          
          <button className="action-btn notification-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          
          <div className="user-menu">
            <button className="action-btn user-btn" onClick={toggleUserMenu}>
              <FaUserCircle />
              <span className="user-name">{userName}</span>
            </button>
            
            {userMenuOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <FaUserCircle />
                  <span>{userName}</span>
                </div>
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
