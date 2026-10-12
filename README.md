# 🎬 CineGlass — Apple TV Movie Explorer

> **Submission for Loon Labs — Stage 2 Interview Assessment**  
> *Crafted with React, Redux Toolkit, Material-UI (MUI), React Router, and TMDb API.*  
> *Engineered following Apple TV Liquid Glassmorphism and Mobile-First Responsive Design Principles.*

---

## 🌟 Overview & Highlights

**CineGlass** is a modern, high-performance streaming and cinema discovery platform inspired by the Apple TV interface. It delivers cinematic discovery with frosted glass surfaces, real-time TMDb API integration, instant debounce search, responsive carousels, detailed sheet modals, and full local persistence.

---

## 🚀 Key Features Implemented

### 1. User Interface (UI) & Apple TV Glass Aesthetic
- **Floating Glass Capsule Navigation**: Floating capsule header with blur backdrop (`backdrop-filter: blur(28px)`), navigation tabs, search shortcut, notifications counter, settings gear, and profile avatar.
- **Mobile-First Responsive Dock**: On mobile viewports, the app renders a native iOS-style bottom floating glass dock for comfortable one-handed navigation.
- **Cinematic Hero Carousel**: Full-bleed backdrop showcasing top trending films with multi-stop dark gradients, release year, runtime, IMDb score badge, synopsis, and action buttons (`▶ Play`, `(i) Details`, `(+) Watchlist`).
- **Interactive Poster Cards**: Sleek 16px rounded-corner cards with smooth hover elevation (`scale(1.03)` + glow shadow), golden rating badge, and 1-click `(+)` / `(✓)` watchlist toggle.
- **Apple TV Sheet Modal (Matching Figma)**: Bottom-sheet modal with curved corners, drag handle pill (`—`), high-res backdrop header, category tags, IMDb & Rotten Tomatoes scores, full overview synopsis, and top-billed cast avatar cards.
- **Light & Dark Mode**: One-click theme toggle switching between deep Apple dark glass (`#07080c`) and frosted slate light glass (`#f5f7fb`).

### 2. State Management (Redux Toolkit)
The application manages its entire data flow via **Redux Toolkit** with modular slices:
- `moviesSlice`: Manages trending movies (day/week), trending series, official TMDb genres, search queries, pagination, movie details, active trailers, and filter parameters.
- `favoritesSlice`: Manages user Watchlist and "Continue Watching" history with real-time **LocalStorage** synchronization (`cineglass_favorites` and `cineglass_watch_history`).
- `authSlice`: Handles user credentials, session state, VIP badge, and **LocalStorage** persistence (`cineglass_auth_user`). Includes a **1-Click Demo Login** button for instant evaluation.
- `themeSlice`: Persists user's dark/light preference across browser sessions (`cineglass_theme`).
- `settingsSlice`: Stores custom TMDb API keys and in-app notifications.

### 3. API Integration (The Movie Database - TMDb)
- **Real-Time TMDb v3 Integration**:
  - Trending movies: `/trending/movie/{timeWindow}`
  - Trending series: `/trending/tv/{timeWindow}`
  - Movie search: `/search/movie` with pagination
  - Detailed metadata & credits: `/movie/{id}?append_to_response=videos,credits,similar`
  - Discover & filter: `/discover/movie`
  - Genres list: `/genre/movie/list`
- **Axios Client**: Configured with request interceptors for automated API key injection, 10s timeout, and unified error handling.
- **Offline / Rate-Limit Resilience**: The app bundles realistic fallback datasets matching the design mockups (*Matchbox*, *Spider-Man: Brand New Day*, *Other Mommy*, *Animals*, *Stranger Things*, *Lanterns*), guaranteeing zero blank screens even under network failure.
- **In-App API Key Manager**: Evaluators can open Settings to test or paste their own personal TMDb API key with live verification feedback.

### 4. Search & Bonus Features
- **Instant Search with Debounce**: 450ms debounce mechanism preventing wasteful API calls.
- **Search History Persistence**: The user's last searched movie is automatically stored in `localStorage` and displayed as a clickable chip for 1-tap restore.
- **Infinite Scrolling & "Load More" Toggle**: Built-in `IntersectionObserver` sentinel for seamless infinite scrolling, with a toggle to switch to a **"Load More"** button mode for alternative UX.
- **Comprehensive Filtering**: Filter movies by **Genre**, **Release Year** (2018–2026), and **Minimum Rating** (⭐ 8.0+, 7.0+, 6.0+), alongside sorting by popularity, rating, or release date.
- **YouTube Video Trailer Player**: Integrated 16:9 cinematic YouTube video player modal supporting trailers and teasers fetched directly from TMDb videos.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-driven UI library |
| **Redux Toolkit & React-Redux** | Global predictable state management with persistent slices |
| **Material-UI (MUI v6 / v9)** | Component foundation, styling engine, and theme tokens |
| **React Router v7** | Client-side routing (`/`, `/movies`, `/series`, `/search`, `/favorites`, `/movie/:id`, `/login`) |
| **Axios** | HTTP client with interceptors and error normalization |
| **Vite** | Modern, high-speed build tool and development server |

---

## 📂 Project Structure

```
loon-labs/
├── public/
├── src/
│   ├── api/
│   │   ├── axiosClient.js        # Configured Axios instance with interceptors
│   │   ├── tmdbApi.js            # TMDb API endpoints & methods
│   │   └── mockData.js           # Resilient realistic fallback dataset
│   ├── app/
│   │   └── store.js              # Redux store configuration
│   ├── features/
│   │   ├── auth/                 # Authentication state & actions
│   │   ├── favorites/            # Watchlist & Continue Watching with localStorage
│   │   ├── movies/               # Trending, Search, Filters, Details, Trailers
│   │   ├── settings/             # Custom API key & notification preferences
│   │   └── theme/                # Dark/Light theme mode state
│   ├── components/
│   │   ├── common/
│   │   │   ├── GlassNavbar.jsx   # Top floating Apple TV pill navigation
│   │   │   ├── MobileBottomNav.jsx # Mobile floating glass dock
│   │   │   ├── GlassButton.jsx   # Apple TV pill & circular glass buttons
│   │   │   ├── RatingBadge.jsx   # Golden star rating badge
│   │   │   ├── MirrorBanner.jsx  # Floating mirror announcement pill
│   │   │   └── LoadingSkeleton.jsx # Glass shimmer skeletons
│   │   ├── movie/
│   │   │   ├── MovieCard.jsx     # Reusable poster card with 1-click favorite
│   │   │   ├── MovieRow.jsx      # Horizontal carousel with chevron navigation
│   │   │   ├── MovieGrid.jsx     # Mobile-first responsive poster grid
│   │   │   ├── MovieDetailsModal.jsx # Apple TV sheet modal matching Figma
│   │   │   └── TrailerModal.jsx  # 16:9 YouTube video embed dialog
│   │   ├── hero/
│   │   │   └── HeroBanner.jsx    # Cinematic full-bleed backdrop hero
│   │   ├── search/
│   │   │   ├── SearchBar.jsx     # Debounced input with last search chip
│   │   │   └── FilterBar.jsx     # Genre, year, rating, and sort controls
│   │   ├── auth/
│   │   │   └── LoginModal.jsx    # Glassmorphism login dialog with demo login
│   │   └── settings/
│   │       └── SettingsModal.jsx # API key tester & configuration modal
│   ├── pages/
│   │   ├── HomePage.jsx          # Hero + Continue Watching + Trending Rows
│   │   ├── MoviesPage.jsx        # Explore movies with full filter bar & grid
│   │   ├── SeriesPage.jsx        # TV series collection
│   │   ├── SearchPage.jsx        # Search with infinite scroll / load more
│   │   ├── FavoritesPage.jsx     # Saved Watchlist with empty states
│   │   ├── MovieDetailsPage.jsx  # Dedicated deep-linkable movie page (/movie/:id)
│   │   ├── LoginPage.jsx         # Dedicated full-page login route
│   │   └── NotFoundPage.jsx      # 404 page with return CTA
│   ├── theme/
│   │   └── theme.js              # MUI custom design tokens (Dark & Light glass)
│   ├── utils/
│   │   ├── helpers.js            # Image URLs, runtime, and date formatters
│   │   └── localStorage.js       # Safe localStorage serialization utilities
│   ├── App.jsx                   # Layout, routing, and global modal hosts
│   ├── index.css                 # Global glassmorphism utilities & animations
│   └── main.jsx                  # Root entry with Redux & Router providers
├── .env.example                  # Environment variable template
├── package.json
└── vite.config.js
```

---

## ⚡ Getting Started & Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd "loon-labs"
npm install
```

### 2. Environment Configuration (Optional)
The application includes a pre-configured working TMDb key. You can also specify your own key in a `.env` file:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

### 3. Run Locally
```bash
# Start local development server
npm run dev

# Or using npm start
npm start
```
The app will be accessible at: `http://localhost:3000` (or `http://localhost:5173`).

### 4. Build for Production
```bash
npm run build
```
The production bundle will be output to the `dist/` folder.

---

## 🌐 Deployment (Vercel / Netlify)

### Deploy to Vercel:
1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Set Environment Variable: `VITE_TMDB_API_KEY` (optional).
5. Click **Deploy**.

---

## 🧪 Evaluator Quick-Test Guide

1. **Test Authentication**:
   - Click the user icon in the top navbar or visit `/login`.
   - Click **"1-Click Demo Login"** to immediately authenticate as a test user.
2. **Test Search & Persistence**:
   - Go to Search (`/search`). Type `"Spider-Man"` or `"Avengers"`.
   - Refresh the page: notice your last search query is preserved and rendered as a quick-filter chip.
3. **Test Infinite Scroll vs. Load More**:
   - In Search, toggle the **"Infinite Scroll Active"** switch to test both infinite scroll and manual **"Load More"** button mode.
4. **Test Watchlist & Local Storage**:
   - Click the `(+)` button on any poster.
   - Navigate to **"List"** in the top navigation to see your saved movies persist across reloads.
5. **Test Apple TV Sheet Modal & YouTube Trailer**:
   - Click any movie poster to open the Apple TV sheet modal matching the design mockups.
   - Click **"Watch Trailer"** to play the embedded YouTube trailer.
6. **Test Light / Dark Mode**:
   - Click the sun/moon icon in the top floating capsule to toggle between dark glass and light frosted glass.
7. **Test Custom API Key**:
   - Click the Settings gear icon in the navbar.
   - You can test live API connectivity or insert your own TMDb v3 key.

---

*Developed for the Loon Labs Software Engineering Interview Assessment.*
