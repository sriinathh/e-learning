// src/components/courses/Resources.jsx
import React from 'react';
import './Resources.css';  // Import the CSS file for styling

const Resources = () => {
  // Sample resources for different BTech branches
  const resources = [
    { 
      name: 'C Programming Notes', 
      type: 'PDF', 
      link: '#', 
      description: 'Comprehensive notes on C programming, including syntax and examples.' 
    },
    { 
      name: 'Data Structures and Algorithms', 
      type: 'PDF', 
      link: '#', 
      description: 'Detailed notes covering topics like sorting, searching, and trees.' 
    },
    { 
      name: 'Electrical Circuits Basics', 
      type: 'PDF', 
      link: '#', 
      description: 'Fundamental concepts in electrical circuits with diagrams and examples.' 
    },
    { 
      name: 'Thermodynamics Fundamentals', 
      type: 'PDF', 
      link: '#', 
      description: 'Notes on thermodynamics, laws of heat, and energy systems for Mechanical Engineering.' 
    },
    { 
      name: 'Structural Analysis', 
      type: 'PDF', 
      link: '#', 
      description: 'Materials on structural design, load analysis, and material strengths for Civil Engineering.' 
    },
    { 
      name: 'Mathematics for Engineers', 
      type: 'PDF', 
      link: '#', 
      description: 'Mathematical concepts and techniques crucial for all BTech branches.' 
    },
    { 
      name: 'Programming with Java', 
      type: 'PDF', 
      link: '#', 
      description: 'A complete guide to Java programming, including object-oriented concepts.' 
    },
    { 
      name: 'Environmental Engineering', 
      type: 'PDF', 
      link: '#', 
      description: 'Notes on environmental impact, sustainability, and eco-friendly engineering practices.' 
    },
    { 
      name: 'Database Management Systems', 
      type: 'PDF', 
      link: '#', 
      description: 'Study material on databases, including SQL, relational design, and optimization.' 
    },
    { 
      name: 'Machine Learning Fundamentals', 
      type: 'Web Link', 
      link: 'https://www.example.com', 
      description: 'An online course on Machine Learning covering algorithms, models, and applications.' 
    },
  ];

  return (
    <div className="resources-container">
      <h3>BTech Resources</h3>
      <p>Here are the resources available for various BTech courses:</p>
      <div className="resources-list">
        {resources.map((resource, index) => (
          <div className="resource-item" key={index}>
            <h4>{resource.name}</h4>
            <p>{resource.description}</p>
            <a href={resource.link} className="resource-link" target="_blank" rel="noopener noreferrer">
              Download {resource.type}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
