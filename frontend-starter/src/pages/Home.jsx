import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([
    { 
      title: "Web Development Bootcamp", 
      desc: "Learn HTML, CSS, JS, and build real-world projects.", 
      img: "https://res.cloudinary.com/dfeyi8eom/image/upload/v1745680866/web_dev_psfrrw.jpg", 
      
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
    },
    { 
      title: "AI with Python", 
      desc: "Dive into AI using Python, Chatbots, and LLMs.",
      img: "https://res.cloudinary.com/dfeyi8eom/image/upload/v1745680865/pytonai_bu1qgm.jpg", 
       
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
    },
    { 
      title: "UI/UX Mastery", 
      desc: "Design user-first interfaces and mobile apps.", 
      img: "https://res.cloudinary.com/dfeyi8eom/image/upload/v1745680865/uiux_e6hhcd.jpg",
     
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
    },
    { 
      title: "Digital Marketing Pro", 
      desc: "Master SEO, Ads, and social media strategy.", 
      img: "https://res.cloudinary.com/dfeyi8eom/image/upload/v1745680865/digimarketing_iees3f.jpg", 
   
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
    }
  ]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredCourses(
      filteredCourses.filter(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) || 
        course.desc.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="fade-in"></h1>
          <p className="fade-in-delay">Explore thousands of courses, improve your skills, and transform your career!</p>
          <div className="search-bar slide-in-bottom">
            <input 
              type="text" 
              placeholder="Search for courses, skills, or instructors..." 
              value={searchQuery} 
              onChange={handleSearch} 
            />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="categories fade-in">
        <h2>Popular Categories</h2>
        <div className="category-list">
          {['Web Development', 'Data Science', 'AI & ML', 'Design', 'Marketing', 'Business'].map((category, index) => (
            <div className="category-card zoom-in" key={index}>
              <h3>{category}</h3>
              <p>Explore courses on {category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="featured-courses fade-in-delay">
        <h2>Featured Courses</h2>
        <div className="course-list">
          {filteredCourses.map((course, index) => (
            <div className="course-card pop-up" key={index}>
              <div className="course-image">
                <img src={course.img} alt={course.title} />
              </div>
             
              <div className="course-details">
                <h3>{course.title}</h3>
                <p>{course.desc}</p>
                <a href={course.link} target="_blank" className="enroll-button">Enroll Now</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enrolled Courses Section */}
      <section className="enrolled-courses fade-in">
        <h2>Your Enrolled Courses</h2>
        <div className="course-list">
          {[ 
            { title: "React for Beginners", desc: "Master React.js and build modern web apps.", img: "https://res.cloudinary.com/dfeyi8eom/image/upload/v1745680864/reactbeg_z2ax0r.jpg" },
            { title: "Python for Data Science", desc: "Learn Python and dive into data science.", img: "https://res.cloudinary.com/dfeyi8eom/image/upload/v1745680846/pydata_rm2xme.jpg" }
          ].map((course, index) => (
            <div className="course-card enrolled" key={index}>
              <div className="course-image">
                <img src={course.img} alt={course.title} />
              </div>
             
              <div className="course-details">
                <h3>{course.title}</h3>
                <p>{course.desc}</p>
                <button className="continue-button">Continue</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Navigation Section */}
      <section className="feature-navigation fade-in">
        <h2>Quick Access</h2>
        <div className="feature-list">
          <Link to="/simple-course" className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Course Management System</h3>
            <p>Manage academic and faculty modules efficiently</p>
          </Link>
          <Link to="/placement" className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Placement Hub</h3>
            <p>Access job opportunities and placement resources</p>
          </Link>
          <Link to="/community" className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Connect with peers and join discussions</p>
          </Link>
          <Link to="/messages" className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Messages</h3>
            <p>Direct messaging with students and faculty</p>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials fade-in-delay">
        <h2>What Our Students Say</h2>
        <div className="testimonial-cards">
          {[ 
            { name: "John Doe", feedback: "CampusConnect has been a game changer for my career. The courses are top-notch!", image: "https://res.cloudinary.com/dfeyi8eom/image/upload/v1745680829/johndoe_euwnz8.jpg" },
            { name: "Jane Smith", feedback: "The platform's UI is amazing and the courses are incredibly useful.", image: "https://res.cloudinary.com/dfeyi8eom/image/upload/v1745680829/janesmith_icnprz.jpg" }
          ].map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <img src={testimonial.image} alt={testimonial.name} />
              <h4>{testimonial.name}</h4>
              <p>"{testimonial.feedback}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer slide-in-bottom">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} CampusConnect. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-socials">
            <a href="https://www.instagram.com/campusconnect" target="_blank">Instagram</a>
            <a href="mailto:contact@campusconnect.com">Email</a>
            <a href="https://www.linkedin.com/company/campusconnect" target="_blank">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
