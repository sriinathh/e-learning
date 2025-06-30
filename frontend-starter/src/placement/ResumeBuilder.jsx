import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    skills: '',
    education: '',
    experience: '',
    projects: '',
    certifications: '',
    achievements: '',
    languages: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to placement hub and pass form data as state
    navigate('/placementhub', { state: { formData } });
  };

  return (
    <div className="resume-builder">
      <h1>ATS-Friendly Resume Builder</h1>
      <form onSubmit={handleSubmit} className="resume-form">
        {Object.keys(formData).map((field) => (
          <div key={field} className="form-group">
            <label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}:</label>
            <textarea
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field.replace(/_/g, ' ')}`}
            />
          </div>
        ))}
        <button type="submit">Generate Resume</button>
      </form>
    </div>
  );
};

export default ResumeBuilder;
