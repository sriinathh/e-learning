import React from "react";
import "./Certificate.css";
import logo from "../../assets/campus.jpg";
import instructorSignature from "../../assets/ins.png";
import coordinatorSignature from "../../assets/cor.png";

const Certificate = ({ studentName, courseName, date, trainerName }) => {
  // Use props or default values
  const recipient = studentName || "Srinath R";
  const course = courseName || "Introduction to Functional and Object-Oriented Programming in Scala";
  const completionDate = date || "May 2, 2025";
  const trainer = trainerName || "Dr. Angela Yu";
  
  return (
    <div className="certificate-container">
      <div className="badge">CampusConnect</div>

      <div className="logo">
        <img
          src={logo}
          alt="CampusConnect Logo"
        />
      </div>

      <div className="certificate-title">Certificate of Completion</div>
      <div className="subtitle">This certificate is proudly presented to</div>

      <div className="recipient">{recipient}</div>

      <div className="text">
        for successfully completing the course on
        <br />
        <span className="highlight">
          "{course}"
        </span>
        <br />
        completed on <strong>{completionDate}</strong> as part of the{" "}
        <strong>Campusonnect Learning Series</strong>.
      </div>

      <div className="details">
        Duration: 40 Hours &nbsp; | &nbsp; Mode: Online &nbsp; | &nbsp; Trainer: {trainer}
      </div>

      <div className="signatures">
        <div className="sign-box">
          <img
            src={instructorSignature}
            alt="Trainer Signature"
            className="signature-img"
          />
          <div className="sign-line"></div>
          <div className="sign-name">{trainer}</div>
          <div className="sign-role">Course Instructor</div>
        </div>
        <div className="sign-box">
          <img
            src={coordinatorSignature}
            alt="Director Signature"
            className="signature-img"
          />
          <div className="sign-line"></div>
          <div className="sign-name">Dr. Sravanthi</div>
          <div className="sign-role">Director, CampusConnect</div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
  