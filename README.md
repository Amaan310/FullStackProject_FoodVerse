# FoodVerse 🍲 - A Recipe Sharing Platform

- A full-stack **Food Recipe Sharing/Management Application** built with the **MERN stack (MongoDB, Express, React, Node.js)**  
- It allows users to **sign up, log in, add/share recipes, delete and update recipes and explore recipes** 
- Users can even explore recipes as per thier taste via category or using filters
  
---

## Features 🚀 

- User Authentication: Robust Signup and Login system secured with JWT (JSON Web Tokens) for stateless authentication. 🔑
- Secure Passwords: User passwords are safeguarded through industry-standard bcryptjs hashing, ensuring data integrity. 🔒
- Recipe Management: Users can add new recipes complete with detailed instructions and a captivating image upload feature. 🖼️
- Dynamic Recipe Display: Explore a rich collection of recipes, each showcasing creator information, and easily filter them by various categories to find exactly what you're craving. 🏷️
- RESTful API: A well-structured and efficient RESTful API built with Express.js to handle all backend operations and interact with the MongoDB database. 📡
- Protected Routes: Sensitive API endpoints are secured using middleware, ensuring only authenticated users can access specific functionalities. 🛡️
- Intuitive Frontend: A modern, responsive, and user-friendly interface developed with React.js and styled using Tailwind CSS for a delightful user experience. ✨

---

## Tech Stack 🧰⚙️💻📱☁️👨‍💻

**Frontend**:

- React.js: A declarative, component-based JavaScript library for building dynamic user interfaces. ⚛️
- Tailwind CSS: A highly customizable, utility-first CSS framework for rapid UI development. 🎨
- Axios: Promise-based HTTP client for making API requests from the browser. 🌐
- React Router: For declarative routing within the single-page application. 🧭

**Backend**:

- Node.js: A JavaScript runtime for building scalable server-side applications. 🟢
- Express.js: A fast, unopinionated, minimalist web framework for Node.js. 🚀
  
**Database**:

- MongoDB: A flexible NoSQL document database for storing application data. 🍃
- Mongoose: An elegant MongoDB object modeling tool for Node.js, simplifying data interactions.

**Authentication**:

- JWT (JSON Web Tokens): For secure and compact token-based authentication. 🔐
- bcryptjs: For robust password hashing, ensuring user security. 🛡️

**File Uploads**:

- Multer: A Node.js middleware for handling multipart/form-data, primarily used for uploading files. 📤

**Contact Form**:

- EmailJS: For sending emails directly from the frontend without needing a backend email server. 📧

---

## Project Structure 📂📁🗂️📑🧱📝
```bash
foodverse 
├── backend/
│   ├── config/
│   │   └── ⚙️ dbcon.js
│   │
│   ├── controllers/
│   │   ├── ⚙️createrecipe.js
│   │   ├── ⚙️deleterecipe.js
│   │   ├── ⚙️getrecipe.js
│   │   ├── ⚙️updaterecipe.js
│   │   ├── ⚙️userlogin.js
│   │   ├── ⚙️userprofile.js
│   │   └── ⚙️usersignup.js
│   │
│   ├── middlewares/
│   │   └── ⚙️ auth.js
│   │
│   ├── models/
│   │   ├── 📦 recipe.js
│   │   └── 📦 user.js
│   │  
│   ├── node_modules
│   │
│   ├── public/
│   │   ├── 🖼️ images
│   │
│   ├── routes/
│   │   ├── 🔗 recipe.js
│   │
│   ├── 📄 .env
│   ├── 📄 package-lock.json
│   └── 📄 package.json
│   ├── 📄 server.js
│   │ 
├── frontend/ 
│   ├── public/
│   │   └── images/
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │  
│   │   │
│   │   ├── components/
│   │   │   ├── ⚛️ ContactForm.jsx
│   │   │   ├── ⚛️ Footer.jsx
│   │   │   ├── ⚛️ InputForm.jsx
│   │   │   ├── ⚛️ LatestRecipes.jsx
│   │   │   ├── ⚛️ mainNavigations.jsx
│   │   │   ├── ⚛️ Model.jsx
│   │   │   ├── ⚛️ Navbar.jsx
│   │   │   └── ⚛️ RecipeItems.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── 📜 useFavorites.js
│   │   │
│   │   ├── pages/
│   │   │   ├── 🎨 AboutPage.css
│   │   │   ├── ⚛️ AboutPage.jsx
│   │   │   ├── ⚛️ AddFoodRecipe.jsx
│   │   │   ├── ⚛️ CategoriesPage.jsx
│   │   │   ├── ⚛️ EditRecipe.jsx
│   │   │   ├── ⚛️ home.jsx
│   │   │   ├── ⚛️ RecipeDetails.jsx
│   │   │   └── ⚛️ RecipesPage.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── ⚛️ tagStyles.jsx
│   │   │
│   │   ├── 🎨 App.css
│   │   ├── ⚛️ App.jsx
│   │   ├── 🎨 index.css
│   │   └── ⚛️ main.jsx
│   │
│   ├── 📄 .gitignore
│   ├── 📄 eslint.config.js
│   ├── 📄 index.html
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   └── 📄 vite.config.js 
│ 
├── 📄 README.md
```
---

## Author 👨‍💻✍️📖

**Amaan Haque**
- Email 📧: amaanhaq77@gmail.com
