import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useLocation, Link } from "react-router-dom";
import campusLogo from "../../assets/campus.jpg";
import coordinatorSignature from "../../assets/cor.png";
import instructorSignature from "../../assets/ins.png";
import "./Certificate.css";

const DownloadCertificate = () => {
  const certificateRef = useRef();
  const location = useLocation();
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get the certificate ID from the URL query params
    const params = new URLSearchParams(location.search);
    const certificateId = params.get('id');
    
    if (certificateId) {
      // Fetch the certificate data from localStorage
      const savedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");
      const certificate = savedCertificates.find(cert => cert.id.toString() === certificateId);
      
      if (certificate) {
        setCertificateData(certificate);
      }
    }
    
    setLoading(false);
  }, [location]);
  
  // Set default values if not provided
  const studentName = certificateData?.name || "Student Name";
  const courseName = certificateData?.course || "Advanced Web Development";
  const completionDate = certificateData?.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const instructor = certificateData?.instructor || "Dr. Johnson";
  
  const handlePrint = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: `${studentName}_Certificate`,
  });
  
  const handleDownload = () => {
    handlePrint();
  };

  if (loading) {
    return <div className="loading-container">Loading certificate...</div>;
  }

  if (!certificateData) {
    return (
      <div className="certificate-not-found">
        <h2>Certificate Not Found</h2>
        <p>The certificate you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses/certificate" className="back-to-certificates">
          Back to Certificates
        </Link>
      </div>
    );
  }

  return (
    <div className="download-certificate-container">
      <div className="certificate-header-bar">
        <h2>Your Certificate of Completion</h2>
        <div className="certificate-controls">
          <button onClick={handleDownload} className="print-certificate-btn">
            <span className="print-icon">🖨️</span> Print / Download PDF
          </button>
          <Link to="/courses/certificate" className="back-to-certs-btn">
            Back to Certificates
          </Link>
        </div>
      </div>
      
      <div className="certificate-frame">
        <div className="certificate-print-buttons">
          <button onClick={handleDownload} className="floating-print-btn" title="Print Certificate">
            🖨️
          </button>
        </div>
        
        <div className="certificate-container-wrapper">
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
              completed on <strong>{completionDate}</strong> as part of the{" "}
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
      </div>
      
      <div className="certificate-info-panel">
        <div className="info-section">
          <h3>Certificate Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Recipient</span>
              <span className="info-value">{studentName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Course</span>
              <span className="info-value">{courseName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date</span>
              <span className="info-value">{completionDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value">Verified ✓</span>
            </div>
          </div>
        </div>
        
        <div className="next-steps-section">
          <h3>What's Next?</h3>
          <ul className="steps-list">
            <li>Download your certificate by clicking the print button above</li>
            <li>Share your achievement on LinkedIn and other social platforms</li>
            <li>Add this certification to your resume</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DownloadCertificate; 