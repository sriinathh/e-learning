import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 
import './Placement.css';
import JobOpportunities from './JobOpportunities';
import ResumeBuilder from './ResumeBuilder';
import InterviewPrep from './InterviewPrep';
import SupportForm from './SupportForm';
import CompanyInsights from './CompanyInsights';

const PlacementHub = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div className="placement-hub">
      <h1 className="heading">Welcome to EduConnect Placement Hub</h1>
      <div className="placement-sections">
        {/* Links to navigate to different sections */}
        <Link 
          to="jobs" 
          className="placement-box animated-box"
          onClick={() => setSelectedSection('jobs')}
        >
          <span className="icon">💼</span> Job Opportunities
        </Link>
        <Link 
          to="resume" 
          className="placement-box animated-box"
          onClick={() => setSelectedSection('resume')}
        >
          <span className="icon">📝</span> Resume Builder
        </Link>
        <Link 
          to="interview" 
          className="placement-box animated-box"
          onClick={() => setSelectedSection('interview')}
        >
          <span className="icon">🎤</span> Mock Interviews
        </Link>
        <Link 
          to="insights" 
          className="placement-box animated-box"
          onClick={() => setSelectedSection('insights')}
        >
          <span className="icon">🏢</span> Company Insights
        </Link>
        <Link 
          to="support" 
          className="placement-box animated-box"
          onClick={() => setSelectedSection('support')}
        >
          <span className="icon">💬</span> Placement Support
        </Link>
        
        {/* Adding Mega Link as a new section */}
        <a
          href="https://mega.nz/folder/3IAXCTiZ#LywIcbguvDy3T4x-TUfIOw/folder/TY43UBIB"
          target="_blank"
          rel="noopener noreferrer"
          className="placement-box animated-box"
        >
          <span className="icon">🔗</span> Access Resources (Mega)
        </a>
      </div>

      {/* Render the corresponding page based on selected section */}
      <Routes>
        <Route 
          path="jobs" 
          element={ 
            <div className={`page-content ${selectedSection === 'jobs' ? 'show' : ''}`}>
              <JobOpportunities />
            </div>
          } 
        />
        <Route 
          path="resume" 
          element={ 
            <div className={`page-content ${selectedSection === 'resume' ? 'show' : ''}`}>
              <ResumeBuilder />
            </div>
          } 
        />
        <Route 
          path="interview" 
          element={ 
            <div className={`page-content ${selectedSection === 'interview' ? 'show' : ''}`}>
              <InterviewPrep />
            </div>
          } 
        />
        <Route 
          path="insights" 
          element={ 
            <div className={`page-content ${selectedSection === 'insights' ? 'show' : ''}`}>
              <CompanyInsights />
            </div>
          } 
        />
        <Route 
          path="support" 
          element={ 
            <div className={`page-content ${selectedSection === 'support' ? 'show' : ''}`}>
              <SupportForm />
            </div>
          } 
        />
       
        {/* Default Route */}
        <Route
          path="/"
          element={ 
            <div className="placement-box">
              <span className="icon">🏠</span> Choose a section above.
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default PlacementHub;
