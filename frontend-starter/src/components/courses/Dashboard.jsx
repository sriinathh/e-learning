import React, { useState } from "react";
import SidebarNav from "./SidebarNav";

const Dashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([
    { id: 1, name: "React Basics" },
    { id: 2, name: "JavaScript Advanced" },
  ]);

  const [certificates, setCertificates] = useState([
    { id: 1, name: "React Basics Certificate" },
    { id: 2, name: "JavaScript Advanced Certificate" },
  ]);

  const handleSelectCourse = (course) => {
    console.log(`Selected course: ${course.name}`);
  };

  const handleSelectCertificate = (certificate) => {
    console.log(`Selected certificate: ${certificate.name}`);
    // You can add logic here to open the certificate or download it
  };

  const handleShowAll = () => {
    console.log("Show all courses");
  };

  // Function to dynamically generate a certificate
  const generateCertificate = (courseName) => {
    const newCertificate = {
      id: certificates.length + 1,
      name: `${courseName} Certificate`,
    };
    setCertificates([...certificates, newCertificate]);
  };

  return (
    <div className="dashboard">
      <SidebarNav
        enrolledCourses={enrolledCourses}
        certificates={certificates}
        onSelectCourse={handleSelectCourse}
        onShowAll={handleShowAll}
        onSelectCertificate={handleSelectCertificate}
      />
      <button onClick={() => generateCertificate("Node.js Basics")}>
        Generate Node.js Certificate
      </button>
    </div>
  );
};

export default Dashboard;
