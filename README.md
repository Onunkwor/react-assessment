# 🎬 Movie Collection Dashboard

## 📌 Overview

**Movie Collection Dashboard** is a responsive React application that allows users to manage their personal movie collection. It includes features such as filtering, search, CRUD operations, and data visualization. The application fetches external movie data using an API and provides an interactive user experience.

## 🚀 Live Demo & Repository

- 🔗 **Live Demo:** [Movie Dashboard](https://react-assessment-virid.vercel.app/dashboard)
- 📦 **GitHub Repository:** [GitHub Repo](https://github.com/Onunkwor/react-assessment)

## 🛠️ Features

### ✅ Core Features

- **Movie List Display** – Shows movies with details (title, year, genre, rating).
- **Search & Filtering** – Users can search movies and filter by genre.
- **CRUD Operations** – Add, edit, and delete movies from the collection. _(Movies are stored in local storage for persistence.)_
- **Statistics Dashboard** – Provides insights like top-rated movies and genre distribution.
- **Responsive UI** – Adapts to different screen sizes.
- **🚀 DeepSeek Explanation** –  
  ✨ **Uses DeepSeek to generate persuasive movie descriptions, encouraging users to watch!**

### ✨ Newly Added Features

- **Genre-Based Filtering & Search for "My Movies" Section**
  - Users can filter their personal collection by selecting a genre.
  - Real-time search allows finding movies by title.
- **Movie API Integration**
  - Fetches a list of trending/popular movies from an external API.
  - Displays additional movie suggestions.
- **Optimized State Management**
  - Efficient use of React Hooks to manage state without unnecessary re-renders.
- **Error Handling & Loading States**
  - Displays loading skeletons and error messages for better UX.
- **Improved UI/UX**
  - Uses ShadCN components for a modern and consistent design.

## 🏗️ Tech Stack

- **Frontend:** React (w/ Hooks) + TypeScript
- **Styling:** Tailwind CSS + ShadCN Components
- **State Management:** React `useState`, `useEffect`
- **Data Fetching:** Fetch API / Axios
- **API Used:** [TMDB (The Movie Database) API](https://developer.themoviedb.org/reference/intro/getting-started)

## ⚙️ Setup & Installation

```sh
# Clone the repository
git clone https://github.com/Onunkwor/react-assessment.git
cd react-assessment

# Install dependencies
npm install  # or yarn install

# Set up environment variables
cp .env.example .env   # Add your API key

# Start the development server
npm run dev  # or yarn dev
```

## 📌 Key Decisions & Assumptions

### 🚀 Technology Choices

- **React with TypeScript** – Used for type safety and improved developer experience.
- **State Management** – Chose React's `useState` and `useEffect` instead of Redux for simplicity, given the project scope.
- **UI Components** – Used **ShadCN + Tailwind CSS** for a clean, modern UI.

### 🔗 API & Data Handling

- **TMDB API Integration** – Used TMDB API for fetching movie data instead of creating a mock backend.
- **Optimized Search** – Implemented **debouncing** in the search feature to optimize API calls and avoid unnecessary requests.

### 🔍 Assumptions Made

- **Movie Ratings & Genres** – Assumed that every movie from the API has a valid genre and rating.
- **Pagination** – The app fetches and displays only a limited number of movies to optimize performance.
- **CRUD Operations** – The **"Add Movies"** section supports full CRUD, while API-fetched movies are read-only.(User-added movies are stored in local storage for persistence.)

```

```
