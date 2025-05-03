import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Link } from "react-router-dom";
import campusLogo from "../../assets/campus.jpg";
import coordinatorSignature from "../../assets/cor.png";
import instructorSignature from "../../assets/ins.png";
import "./Certificate.css";

const GenerateCertificate = ({ onGenerate, courseData = {} }) => {
  const [studentName, setStudentName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const certificateRef = useRef();
  
  // Format today's date for certificate
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  // Course name with fallback
  const courseName = courseData.name || "Advanced Web Development";
  const instructor = courseData.instructor || "Dr. Johnson";
  
  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `${studentName}_Certificate`,
  });
  
  const handleGenerateCertificate = () => {
    if (studentName.trim()) {
      setIsSubmitting(true);
      
      // Show certificate immediately
      setShowCertificate(true);
      
      // Create certificate object
      const newCertificate = { 
        id: Date.now(), 
        name: studentName,
        course: courseName,
        instructor: instructor,
        date: currentDate
      };
      
      // Save to state via prop
      if (onGenerate) {
        onGenerate(newCertificate);
      }
      
      // No redirect, we show the certificate inline
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="generate-certificate-page">
      {!showCertificate ? (
        <div className="generate-form-container">
          <div className="certificate-header">
            <img src={campusLogo} alt="Campus Logo" className="certificate-header-logo" />
            <h1>Generate Your Certificate</h1>
          </div>
          
          <div className="certificate-form-wrapper">
            <div className="form-instructions">
              <h2>Complete Your Certificate</h2>
              <p>
                Congratulations on completing the course! Enter your name below exactly as you'd like it to appear on your certificate.
              </p>
            </div>
            
            <div className="certificate-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="form-input"
                />
                <p className="form-help">This is how your name will appear on the certificate</p>
              </div>
              
              <div className="form-group">
                <label>Course Completed</label>
                <div className="course-preview">{courseName}</div>
              </div>
              
              <div className="form-group">
                <label>Completion Date</label>
                <div className="date-preview">{currentDate}</div>
              </div>
              
              <button 
                type="button" 
                onClick={handleGenerateCertificate}
                disabled={!studentName.trim() || isSubmitting}
                className="generate-certificate-button"
              >
                {isSubmitting ? 'Generating...' : 'Generate & View Certificate'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="certificate-result-container">
          <div className="certificate-controls">
            <div className="controls-left">
              <button onClick={() => setShowCertificate(false)} className="back-button">
                ← Back to Form
              </button>
            </div>
            <div className="controls-right">
              <button onClick={handlePrint} className="print-button">
                🖨️ Print Certificate
              </button>
              <Link to="/courses/certificate" className="all-certificates-link">
                View All Certificates
              </Link>
            </div>
          </div>
          
          <div className="certificate-preview-frame">
            <div className="certificate-container" ref={certificateRef}>
              <div className="badge">CampusConnect</div>

              <div className="logo">
                <img
                  src={campusLogo}
                  alt="CampusConnect Logo"
                  className="certificate-logo"
                />
              </div>

              <div className="certificate-title">Certificate of Completion</div>
              <div className="subtitle">This certificate is proudly presented to</div>

              <div className="recipient">{studentName}</div>

              <div className="text">
                for successfully completing the course on
                <br />
                <span className="highlight">
                  "{courseName}"
                </span>
                <br />
                completed on <strong>{currentDate}</strong> as part of the{" "}
                <strong>CampusConnect Skill Enhancement Series</strong>.
              </div>

              <div className="details">
                Duration: 40 Hours &nbsp; | &nbsp; 
                Mode: Online &nbsp; | &nbsp; 
                Instructor: {instructor}
              </div>

              <div className="certificate-signature">
                <div className="signature-block">
                  <img src={instructorSignature} alt="Instructor's Signature" className="signature-image" />
                  <div className="signature-line"></div>
                  <div className="signature-name">{instructor}</div>
                  <div className="signature-title">Course Instructor</div>
                </div>
                <div className="signature-block">
                  <img src={coordinatorSignature} alt="Coordinator's Signature" className="signature-image" />
                  <div className="signature-line"></div>
                  <div className="signature-name">Program Director</div>
                  <div className="signature-title">CampusConnect</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="certificate-success-message">
            <h2>Your Certificate is Ready!</h2>
            <p>You can print it now or access it anytime from your certificates page.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateCertificate; 