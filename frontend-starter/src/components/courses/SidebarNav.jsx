import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./SidebarNav.css";
import { 
  FaGraduationCap, 
  FaBook, 
  FaCertificate, 
  FaHome, 
  FaUserAlt, 
  FaSearch, 
  FaRegClock,
  FaChartLine,
  FaCode,
  FaServer,
  FaDatabase,
  FaMobileAlt,
  FaCloud,
  FaRobot,
  FaChalkboardTeacher
} from "react-icons/fa";

const SidebarNav = ({ 
  enrolledCourses = [], 
  onSelectCourse = () => console.log('Select course'), 
  onShowAll = () => console.log('Show all courses'), 
  isOpen = false, 
  courseProgress = {} 
}) => {
  // No need for handleShowAll since we're providing the default in the parameters
  
  return (
    <nav className={`sidebar-nav ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <FaGraduationCap /> CampusConnect
        </Link>
      </div>

      <div className="sidebar-search">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search for courses" className="search-input" />
        </div>
      </div>

      <div className="sidebar-category">
        <h3>Learning</h3>
        <Link to="/dashboard" className="nav-link">
          <FaHome /> <span>Dashboard</span>
        </Link>
        <a onClick={onShowAll} className="nav-link active">
          <FaGraduationCap /> <span>All Courses</span>
        </a>
        <Link to="/profile" className="nav-link">
          <FaUserAlt /> <span>My Profile</span>
        </Link>
      </div>

      <div className="sidebar-category">
        <h3>Course Categories</h3>
        <a onClick={onShowAll} className="nav-link">
          <FaCode /> <span>Web Development</span>
        </a>
        <a onClick={onShowAll} className="nav-link">
          <FaServer /> <span>Backend Development</span>
        </a>
        <a onClick={onShowAll} className="nav-link">
          <FaDatabase /> <span>Data Science</span>
        </a>
        <a onClick={onShowAll} className="nav-link">
          <FaMobileAlt /> <span>Mobile Development</span>
        </a>
        <a onClick={onShowAll} className="nav-link">
          <FaCloud /> <span>Cloud Computing</span>
        </a>
        <a onClick={onShowAll} className="nav-link">
          <FaRobot /> <span>Artificial Intelligence</span>
        </a>
        <a onClick={onShowAll} className="nav-link">
          <FaChalkboardTeacher /> <span>Career Development</span>
        </a>
      </div>

      {enrolledCourses.length > 0 && (
        <div className="sidebar-category">
          <h3>My Learning</h3>
          {enrolledCourses.map((course) => (
            <a 
              key={course.id} 
              className="nav-link enrolled-item"
              onClick={() => onSelectCourse(course)}
            >
              <FaBook /> 
              <div className="course-progress-info">
                <span>{course.name}</span>
                <div className="progress-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${courseProgress[course.id] || 0}%` }}
                  ></div>
                </div>
                <div className="progress-details">
                  <span className="progress-percentage">{courseProgress[course.id] || 0}%</span>
                  <span className="progress-date"><FaRegClock /> Last viewed today</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="sidebar-category">
        <h3>Resources</h3>
        <Link to="/courses/resources" className="nav-link">
          <FaBook /> <span>Learning Resources</span>
        </Link>
        <Link to="/courses/certificate" className="nav-link">
          <FaCertificate /> <span>Certificates</span>
        </Link>
        <Link to="/analytics" className="nav-link">
          <FaChartLine /> <span>Learning Analytics</span>
        </Link>
      </div>

      <div className="sidebar-footer">
        <p>© 2023 CampusConnect</p>
        <p>Elevate Your Learning</p>
      </div>
    </nav>
  );
};

SidebarNav.propTypes = {
  enrolledCourses: PropTypes.arrayOf(
    PropTypes.shape({ 
      id: PropTypes.number, 
      name: PropTypes.string 
    })
  ),
  onSelectCourse: PropTypes.func,
  onShowAll: PropTypes.func,
  isOpen: PropTypes.bool,
  courseProgress: PropTypes.object
};

export default SidebarNav;
