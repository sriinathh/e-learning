import React from "react";
import "./Certificate.css";
import campusLogo from "../../assets/campus.jpg";
import coordinatorSignature from "../../assets/cor.png";
import instructorSignature from "../../assets/ins.png";

const Certificate = ({ courseData, studentName, completionDate }) => {
  return (
    <div className="certificate-container">
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

      <div className="recipient">{studentName || "Student Name"}</div>

      <div className="text">
        for successfully completing the course on
        <br />
        <span className="highlight">
          "{courseData?.name || "Course Name"}"
        </span>
        <br />
        completed on <strong>{completionDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong> as part of the{" "}
        <strong>CampusConnect Skill Enhancement Series</strong>.
      </div>

      <div className="details">
        Duration: {courseData?.duration || "40 Hours"} &nbsp; | &nbsp; 
        Mode: Online &nbsp; | &nbsp; 
        Instructor: {courseData?.instructor || "Instructor Name"}
      </div>

      <div className="certificate-signature">
        <div className="signature-block">
          <img src={instructorSignature} alt="Instructor's Signature" className="signature-image" />
          <div className="signature-line"></div>
          <div className="signature-name">{courseData?.instructor || "Instructor Name"}</div>
          <div className="signature-title">{courseData?.instructorTitle || "Course Instructor"}</div>
        </div>
        <div className="signature-block">
          <img src={coordinatorSignature} alt="Coordinator's Signature" className="signature-image" />
          <div className="signature-line"></div>
          <div className="signature-name">Program Director</div>
          <div className="signature-title">CampusConnect</div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
