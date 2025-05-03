// File: /src/components/SupportForm.jsx
import React, { useState } from "react";
import './SupportForm.css'; // Import CSS for styling

const SupportForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real scenario, you'd handle the form submission here (e.g., sending to an API or email)
    alert("Support request submitted. We will contact you soon.");
  };

  // WhatsApp Support Message Template
  const whatsappMessage = `Hi, I need placement support. My name is ${formData.name} and my email is ${formData.email}. Here's my message: ${formData.message}`;

  return (
    <div id="support" className="section">
      <h2>Placement Support</h2>
      <div className="support-details">
        <p>If you need assistance with your placement, feel free to contact us:</p>
        <ul>
          <li><strong>Phone:</strong> +1 (555) 123-4567</li>
          <li><strong>Email:</strong> <a href="mailto:support@educonnect.com">support@educonnect.com</a></li>
          <li><strong>WhatsApp:</strong> 
            <a 
              href={`https://wa.me/15551234567?text=${encodeURIComponent(whatsappMessage)}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Chat with us on WhatsApp
            </a>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="How can we help you?"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default SupportForm;
