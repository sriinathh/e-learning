// File: /src/components/CompanyInsights.jsx
import React from 'react';

 // Import the CSS for styling

const CompanyInsights = () => {
  return (
    <div id="insights" className="section">
      <h2>Company Insights</h2>
      <div className="insights-container">
        {insights.map((item, index) => (
          <div key={index} className="insight-box">
            <h3>{item.company}</h3>
            <p>{item.details}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="read-more">
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyInsights;
