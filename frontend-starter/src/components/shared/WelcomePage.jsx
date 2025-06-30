import React from "react";
import SidebarNav from "./SidebarNav"; // import the SidebarNav
import CoursePage from "./CoursePage"; // import the CoursePage

const WelcomePage = () => {
  return (
    <div className="welcome-page-container">
      <SidebarNav /> {/* Sidebar Navigation */}
      <div className="welcome-content">
        <h1>Welcome to the Course Platform</h1>
        <p>Select a course from the sidebar to get started!</p>
        <CoursePage /> {/* Display CoursePage component */}
      </div>
    </div>
  );
};

export default WelcomePage;
