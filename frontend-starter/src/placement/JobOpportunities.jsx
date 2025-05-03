import React, { useState } from 'react';
import './JobOpportunities.css';

const companies = [
  { 
    name: 'TCS', 
    role: 'Software Engineer', 
    desc: 'As a Backend Software Engineer, you will develop and maintain server-side applications, ensuring high performance and responsiveness. You\'ll work with cloud technologies and databases to deliver scalable solutions.',
    ctc: '8 LPA', 
    location: 'Hyderabad', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725603/tcs_cuzqci.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Infosys', 
    role: 'Frontend Developer', 
    desc: 'Frontend Developers at Infosys focus on building beautiful, responsive user interfaces using technologies like React, JavaScript, and CSS. You’ll collaborate with UX/UI designers and backend engineers to deliver a seamless experience.',
    ctc: '6.5 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/c_thumb,w_200,g_face/v1745725603/infosys_zwoyoh.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Wipro', 
    role: 'Full Stack Developer', 
    desc: 'Full Stack Developers at Wipro are responsible for both frontend and backend development. You will work on building scalable applications with modern tech stacks like Node.js, React, and MongoDB.',
    ctc: '7.2 LPA', 
    location: 'Chennai', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1745725602/wipro_cvdktk.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Accenture', 
    role: 'Cloud Engineer', 
    desc: 'As a Cloud Engineer, you will design, implement, and maintain cloud services on platforms like AWS, Azure, and Google Cloud. You will also be involved in migration projects and ensuring security in cloud infrastructure.',
    ctc: '8.5 LPA', 
    location: 'Mumbai', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/e_improve,w_300,h_600,c_thumb,g_auto/v1745725602/accenture_pnbl0v.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Cognizant', 
    role: 'Data Scientist', 
    desc: 'Data Scientists at Cognizant work on building machine learning models to solve real-world problems using large datasets. You will work closely with data engineers and business analysts to deliver actionable insights.',
    ctc: '9 LPA', 
    location: 'Pune', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/e_improve,w_300,h_600,c_thumb,g_auto/v1745725602/cognizant_vbc8cs.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Amazon', 
    role: 'DevOps Engineer', 
    desc: 'As a DevOps Engineer at Amazon, you will work on automating cloud infrastructure, CI/CD pipelines, and managing infrastructure as code. You will ensure high availability and scalability for critical systems.',
    ctc: '11 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725602/amazon_qln7qm.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Capgemini', 
    role: 'Security Analyst', 
    desc: 'Security Analysts at Capgemini are responsible for identifying security vulnerabilities and ensuring the protection of client data. You will conduct penetration testing and risk assessments to safeguard critical systems.',
    ctc: '7 LPA', 
    location: 'Hyderabad', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725602/capgemini_mfdbqu.jpg', 
    applyLink: '#'
  },
  { 
    name: 'HCL', 
    role: 'Android Developer', 
    desc: 'Android Developers at HCL focus on building robust, scalable mobile applications using Java/Kotlin. You will work with UX/UI designers to create seamless mobile experiences.',
    ctc: '6.8 LPA', 
    location: 'Noida', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725601/hcl_qy8gs8.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Mindtree', 
    role: 'Business Analyst', 
    desc: 'As a Business Analyst at Mindtree, you will work with stakeholders to gather requirements and design solutions that meet business needs. You will facilitate communication between business and technical teams.',
    ctc: '6 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725599/mind_tree_qt1a45.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Tech Mahindra', 
    role: 'UI/UX Designer', 
    desc: 'UI/UX Designers at Tech Mahindra are responsible for designing intuitive, user-friendly interfaces for web and mobile applications. You will collaborate with developers and product managers to create exceptional user experiences.',
    ctc: '7.5 LPA', 
    location: 'Pune', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725599/techmahindra_ky3mas.jpg', 
    applyLink: '#'
  },
  { 
    name: 'IBM', 
    role: 'Software Developer', 
    desc: 'Software Developers at IBM work on designing, building, and maintaining enterprise applications. You will work in an agile environment, collaborating with cross-functional teams to develop innovative software solutions.',
    ctc: '8 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725599/ibm_fzczrk.jpg', 
    applyLink: '#'
  },
  { 
    name: 'SAP', 
    role: 'SAP Consultant', 
    desc: 'SAP Consultants at SAP assist clients in integrating and optimizing SAP solutions to meet business needs. You will work with clients to understand their processes and recommend appropriate SAP solutions.',
    ctc: '10 LPA', 
    location: 'Hyderabad', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725599/sap_e8ikif.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Oracle', 
    role: 'Database Administrator', 
    desc: 'Database Administrators at Oracle manage and maintain database systems, ensuring they are secure, performant, and scalable. You will work on tuning databases, ensuring data consistency and availability.',
    ctc: '8.2 LPA', 
    location: 'Pune', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725599/oracle_swfeqg.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Facebook', 
    role: 'Machine Learning Engineer', 
    desc: 'Machine Learning Engineers at Facebook focus on building AI-driven solutions, from natural language processing to recommendation systems. You will work with large datasets and machine learning frameworks.',
    ctc: '12 LPA', 
    location: 'Mumbai', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725598/fb_llipso.png', 
    applyLink: '#'
  },
  { 
    name: 'Google', 
    role: 'Product Manager', 
    desc: 'Product Managers at Google oversee the development and launch of products from conception to execution. You will work with engineering, design, and marketing teams to deliver world-class products.',
    ctc: '15 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725598/google_kcune7.png', 
    applyLink: '#'
  },
  { 
    name: 'Apple', 
    role: 'iOS Developer', 
    desc: 'iOS Developers at Apple are responsible for building innovative applications for the iOS platform. You will work with Swift and Objective-C to build world-class mobile apps.',
    ctc: '10.5 LPA', 
    location: 'Hyderabad', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725598/apple_dohuf7.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Microsoft', 
    role: 'Software Engineer Intern', 
    desc: 'Software Engineer Interns at Microsoft contribute to developing features and bug fixes for Microsoft products. This is an opportunity to work on innovative software in a collaborative environment.',
    ctc: '7 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725597/microsoft_nxukyd.jpg', 
    applyLink: '#'
  },
  { 
    name: 'JPMorgan', 
    role: 'Quantitative Analyst', 
    desc: 'Quantitative Analysts at JPMorgan work with large financial datasets, applying statistical and mathematical models to improve trading strategies. You will use Python, R, and other analytics tools.',
    ctc: '20 LPA', 
    location: 'Mumbai', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725598/jp_awrgu8.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Adobe', 
    role: 'Software Engineer', 
    desc: 'Software Engineers at Adobe are responsible for developing creative software tools like Photoshop, Illustrator, and Adobe Cloud applications. You’ll work with the latest technologies in an agile environment.',
    ctc: '12 LPA', 
    location: 'Noida', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725598/adobe_nno2x3.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Twitter', 
    role: 'Data Engineer', 
    desc: 'Data Engineers at Twitter work on designing and implementing data pipelines for processing and analyzing large-scale data. You’ll work with big data tools and technologies like Hadoop, Spark, and Kafka.',
    ctc: '11 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725598/twiter_se5wcv.jpg', 
    applyLink: '#'
  },
  { 
    name: 'LinkedIn', 
    role: 'Software Engineer', 
    desc: 'Software Engineers at LinkedIn work on building scalable systems and infrastructure to connect the world’s professionals. You’ll work on backend, frontend, and mobile app development.',
    ctc: '13 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725597/linkein_tvxcya.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Slack', 
    role: 'Frontend Engineer', 
    desc: 'Frontend Engineers at Slack work on building intuitive interfaces for communication and collaboration tools. You’ll be using JavaScript, React, and other modern web technologies.',
    ctc: '11 LPA', 
    location: 'Pune', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725598/slack_r2xxbw.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Spotify', 
    role: 'Backend Developer', 
    desc: 'Backend Developers at Spotify focus on building scalable systems for music streaming and user data analysis. You’ll work with languages like Python, Java, and Go.',
    ctc: '14 LPA', 
    location: 'Mumbai', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725597/spotify_wzijfo.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Stripe', 
    role: 'Software Engineer', 
    desc: 'Software Engineers at Stripe develop tools for payment processing, fraud detection, and financial products. You’ll work with languages like Go, Ruby, and JavaScript.',
    ctc: '16 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725597/stripe_oon20h.jpg', 
    applyLink: '#'
  },
  { 
    name: 'Uber', 
    role: 'Data Scientist', 
    desc: 'Data Scientists at Uber analyze user behavior and operational data to improve transportation efficiency. You’ll use machine learning models to optimize routing, pricing, and demand prediction.',
    ctc: '15 LPA', 
    location: 'Bangalore', 
    logo: 'https://res.cloudinary.com/dfeyi8eom/image/upload/v1745725597/uber_touc0c.jpg', 
    applyLink: '#'
  }
];


const JobOpportunities = () => {
  const [selected, setSelected] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleApply = (job) => {
    if (formData.name && formData.email) {
      if (!appliedJobs.includes(job.name)) {
        setAppliedJobs([...appliedJobs, job.name]);
        setIsFormSubmitted(true);
        alert(`Successfully applied to ${job.name}`);
      } else {
        alert(`You have already applied to ${job.name}`);
      }
    } else {
      alert('Please fill out the form to apply');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div id="jobs" className="job-section">
      <h2 className="section-heading">Job Opportunities</h2>
      <div className="companies">
        {companies.map((comp, i) => (
          <div className="company-card" key={i} onClick={() => setSelected(comp)}>
            <img src={comp.logo} alt={comp.name} className="company-logo" />
            <h3>{comp.name}</h3>
            <p>{comp.role}</p>
            <button className="details-btn" onClick={() => setSelected(comp)}>View Details</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <img src={selected.logo} alt="Company Logo" className="modal-logo" />
              <h3>{selected.name}</h3>
            </div>
            <p><b>Role:</b> {selected.role}</p>
            <p><b>Description:</b> {selected.desc}</p>
            <p><b>CTC:</b> {selected.ctc}</p>
            <p><b>Location:</b> {selected.location}</p>

            <h4>Apply for this Job</h4>
            <form onSubmit={(e) => { e.preventDefault(); handleApply(selected); }} className="apply-form">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
              <button type="submit" className="apply-btn">Apply</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOpportunities;
