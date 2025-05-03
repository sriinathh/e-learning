import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Certificate.css";
import campusLogo from "../../assets/campus.jpg";
import coordinatorSignature from "../../assets/cor.png";
import instructorSignature from "../../assets/ins.png";

const CertificatePage = ({ certificates = [] }) => {
  const [filter, setFilter] = useState("");

  // Filter certificates based on search input
  const filteredCertificates = certificates.filter(cert => 
    cert.name?.toLowerCase().includes(filter.toLowerCase()) || 
    cert.course?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="certificates-page">
      <div className="certificates-header">
        <div className="title-section">
          <h1>Your Certificates</h1>
          <p>View and manage all your earned certificates</p>
        </div>
        <div className="action-section">
          <Link to="/courses/generateCertificate" className="generate-new-btn">
            Generate New Certificate
          </Link>
        </div>
      </div>

      <div className="certificates-filter">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search certificates..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-info">
          {filteredCertificates.length} {filteredCertificates.length === 1 ? 'certificate' : 'certificates'} found
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="no-certificates">
          <div className="empty-state">
            <img src={campusLogo} alt="Campus Logo" className="empty-state-logo" />
            <h2>No Certificates Yet</h2>
            <p>You haven't generated any certificates yet. Complete a course to earn your first certificate!</p>
            <Link to="/courses/generateCertificate" className="generate-first-btn">
              Generate Sample Certificate
            </Link>
          </div>
        </div>
      ) : (
        <div className="certificates-grid">
          {filteredCertificates.map((certificate) => (
            <div className="certificate-card" key={certificate.id}>
              <div className="mini-certificate">
                <img src={campusLogo} alt="Campus Logo" className="mini-certificate-logo" />
                <div className="mini-certificate-title">Certificate of Completion</div>
                <div className="mini-certificate-recipient">{certificate.name}</div>
                <div className="mini-certificate-course">{certificate.course}</div>
                <div className="mini-certificate-date">{certificate.date}</div>
                <div className="mini-certificate-signatures">
                  <div className="mini-signature-block">
                    <img src={instructorSignature} alt="Instructor's Signature" className="mini-signature-image" />
                    <div className="mini-signature-line"></div>
                    <div className="mini-signature-name">{certificate.instructor}</div>
                  </div>
                  <div className="mini-signature-block">
                    <img src={coordinatorSignature} alt="Coordinator's Signature" className="mini-signature-image" />
                    <div className="mini-signature-line"></div>
                    <div className="mini-signature-name">Director</div>
                  </div>
                </div>
              </div>
              <div className="certificate-card-actions">
                <Link to={`/courses/downloadCertificate?id=${certificate.id}`} className="view-certificate-btn">
                  View Certificate
                </Link>
                <span className="certificate-date">{certificate.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatePage; 