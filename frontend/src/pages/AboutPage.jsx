/* eslint-disable no-unused-vars */
import React from "react";
import "./AboutPage.css";
import { motion } from "framer-motion";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutPage() {
  return (
    <div className="about-container">
      {/* ===== HERO SECTION ===== */}
      <motion.section
        className="about-hero"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h1>About FoodVerse</h1>
        <p className="about-subtitle">
          A modern recipe-sharing platform built for home cooks, food lovers,
          and culinary explorers.
        </p>
      </motion.section>

      {/* ===== INTRO SECTION ===== */}
      <motion.section
        className="about-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2>Our Mission</h2>
        <p>
          FoodVerse was created to make discovering, sharing, and managing
          recipes simple and enjoyable. We believe great food brings people
          together, and every home cook deserves a personal space to store,
          explore, and showcase their favorite dishes.
        </p>
      </motion.section>

      {/* ===== WHAT YOU CAN DO ===== */}
      <motion.section
        className="about-section light-bg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2>What You Can Do on FoodVerse</h2>

        <ul className="about-features">
          <li>
            <strong>Explore Recipes:</strong> Browse a wide range of recipes
            shared by the community across cuisines, meal types, and dietary
            preferences.
          </li>
          <li>
            <strong>Create & Share:</strong> Add your own recipes with images,
            ingredients, instructions, and optional video links.
          </li>
          <li>
            <strong>Manage Your Recipes:</strong> Edit or delete recipes you’ve
            created anytime from your personal dashboard.
          </li>
          <li>
            <strong>Save Favorites:</strong> Build your personal cookbook by
            saving recipes you love.
          </li>
          <li>
            <strong>Browse by Category:</strong> Quickly find recipes by
            categories like Vegetarian, Main Course, Snacks, Regional cuisines,
            and more.
          </li>
          <li>
            <strong>Share Recipes:</strong> Easily share recipes with others via
            social platforms or direct links.
          </li>
        </ul>
      </motion.section>

      {/* ===== WHY FOODVERSE ===== */}
      <motion.section
        className="about-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2>Why FoodVerse?</h2>
        <p>
          Unlike traditional recipe apps, FoodVerse focuses on simplicity,
          usability, and community-driven content. Whether you’re saving family
          recipes, experimenting with new cuisines, or organizing your cooking
          ideas, FoodVerse acts as your digital recipe companion.
        </p>
      </motion.section>

      {/* ===== CONTACT / FEEDBACK ===== */}
      <motion.section
        className="about-section light-bg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2>Get in Touch</h2>
        <p>
          We’re always open to feedback, suggestions, and collaboration ideas.
          If you have questions or thoughts about improving FoodVerse, feel free
          to reach out using the contact option available on the platform.
        </p>
      </motion.section>
    </div>
  );
}
