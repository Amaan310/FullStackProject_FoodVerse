/* eslint-disable no-unused-vars */
import React from "react";
import "./AboutPage.css";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Amaan Haque",
    rollNo: "BETNICS22100",
    email: "amaanhaq77@gmail.com",
    linkedin: "https://www.linkedin.com/in/amaanhaque3",
    github: "https://github.com/Amaan310",
    image: "/images/AmaanDP.png",
  },
  {
    name: "Aryan Saxena",
    rollNo: "BETNICS22163",
    email: "aryansaxena154@gmail.com",
    linkedin: "https://www.linkedin.com/in/aryan-saxena-615318309",
    github: "https://github.com/aryan-18-as",
    image: "/images/AryanDP.jpg",
  },
  {
    name: "Kuldeep Singh Rana",
    rollNo: "BETNICS22040",
    email: "kuldeepsinghrana917@gmail.com",
    linkedin: "https://www.linkedin.com/in/kuldeepsingh-rana",
    github: "https://github.com/KuldeepRana01",
    image: "/images/kuldeepDP.jpg",
  },
  {
    name: "Vanshita Shrivastava",
    rollNo: "BETNICS22182",
    email: "vanshita304@gmail.com",
    linkedin: "https://www.linkedin.com/in/vanshita-shrivastavaa",
    github: "https://github.com/Vanshita013",
    image: "/images/vanshitaDP.jpg",
  },
  {
    name: "Krishna Jain",
    rollNo: "BETNICS22179",
    email: "jkrishna836@gmail.com",
    linkedin: "https://www.linkedin.com/in/krishna-jain-b26912268",
    github: "https://github.com/krishnajain2004",
    image: "/images/krishnaDP.jpg",
  },
];

// ✨ Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function AboutPage() {
  return (
    <div className="about-container">
      {/* 🧠 Animated Heading */}
      <motion.div
        className="about-header"
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1>Meet Our Team</h1>
        <p>
          Meet the passionate team behind our recipe platform. We're committed
          to bringing you delicious recipes and an amazing cooking experience.
        </p>
      </motion.div>

      {/* 👥 Team Grid with Scroll Animation */}
      <motion.div
        className="team-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {teamMembers.map((member, index) => (
          <motion.div key={index} className="team-card" variants={cardVariants}>
            <img
              src={member.image}
              alt={`Profile of ${member.name}`}
              className="profile-pic"
            />
            <h2>{member.name}</h2>
            <p className="roll-no">{member.rollNo}</p>
            <p className="email">{member.email}</p>

            <div className="social-links">
              <a
                href={member.linkedin}
                title="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.1 1.16 3.1 3.36z"></path>
                </svg>
              </a>

              <a
                href={member.github}
                title="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8a9.56 9.56 0 012.52.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0022 12 10 10 0 0012 2z"></path>
                </svg>
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
