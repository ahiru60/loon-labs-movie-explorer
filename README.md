# 🎬 CineGlass — Modern Cinema Explorer

> **Submission for Loon Labs — Stage 2 Interview Assessment**  
> *Crafted with React, Redux Toolkit, Material-UI (MUI), React Router, and the official TMDb API.*  
> *Engineered following Modern Glassmorphism Architecture and Mobile-First Responsive Design Principles.*  
> *Strictly integrated with the official TMDb API reference ([developer.themoviedb.org/reference/getting-started](https://developer.themoviedb.org/reference/getting-started)) with live production endpoints.*  
> 
> 🔗 **Repository**: [https://github.com/ahiru60/loon-labs-movie-explorer](https://github.com/ahiru60/loon-labs-movie-explorer)

---

## 🌟 Overview & Highlights

**CineGlass** is a premium cinema exploration platform designed with modern glassmorphism. It delivers cinematic discovery with frosted translucent surfaces, real-time TMDb API integration, instant debounce search, responsive carousels, interactive details sheets, and full local persistence.

All movie data, TV series, genres, cast credits, official YouTube trailers, and filter queries are fetched directly from **The Movie Database (TMDb) API v3**.

---

## 🚀 Key Features Implemented (Direct TMDb API Integration)

### 1. User Interface (UI) & Modern Glassmorphic Design
- **Floating Glass Capsule Navigation**: Floating capsule header with blur backdrop (`backdrop-filter: blur(28px)`), navigation tabs, search shortcut, notifications, settings gear, and profile avatar.
- **Mobile-First Responsive Dock**: On mobile viewports, the app renders a floating bottom glass dock for ergonomic one-handed navigation.
- **Cinematic Hero Carousel**: Full-bleed backdrop showcasing live top trending films from TMDb with multi-stop dark gradients, release year, runtime, IMDb score badge, synopsis, and action buttons (`▶ Play Trailer`, `(i) Details`, `(+) Watchlist`).
- **Interactive Poster Cards**: Sleek 16px rounded-corner cards with smooth hover elevation (`scale(1.03)` + glow shadow), golden rating badge, and 1-click `(+)` / `(✓)` watchlist toggle.
- **Interactive Details Sheet (Matching Figma)**: Interactive bottom sheet with curved corners, drag handle indicator, high-res backdrop header, category tags, IMDb score, certification, full synopsis, and top-billed cast avatar cards with headshots fetched directly from TMDb.
- **Light & Dark Mode**: One-click theme toggle switching between deep midnight dark glass (`#07080c`) and frosted slate light glass (`#f5f7fb`).
- **Official TMDb Attribution**: Compliant with official TMDb developer terms and branding guidelines.

### 2. State Management (Redux Toolkit)
The application manages its entire data flow via **Redux Toolkit** with modular slices:
- `moviesSlice`: Manages live trending movies (`/trending/movie/{timeWindow}`), now playing in theaters (`/movie/now_playing`), top-rated classics (`/movie/top_rated`), popular releases (`/movie/popular`), TV series (`/trending/tv/{timeWindow}`), official TMDb genres (`/genre/movie/list`), search queries, pagination, movie details, active trailers, and discover filter parameters.
- `favoritesSlice`: Manages user Watchlist with real-time **LocalStorage** synchronization (`cineglass_favorites`).
- `authSlice`: Handles user credentials, session state, VIP status, and **LocalStorage** persistence (`cineglass_auth_user`). Includes a **1-Click Demo Login** button for instant evaluation.
- `themeSlice`: Persists user's dark/light preference across browser sessions (`cineglass_theme`).
- `settingsSlice`: Stores custom TMDb API keys and in-app preferences.

### 3. Supabase Cloud Database & Authentication
- **User Authentication**: Secure Sign-Up and Sign-In with email and password via Supabase Auth (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`), with automatic token persistence and session restoration.
- **Cloud-Synced Watchlist (PostgreSQL Database)**: Persistent `public.favorites` table storing each user's favorited movies with Row-Level Security (RLS) policies (`auth.uid() = user_id`).
- **Optimistic UI Updates**: Instantaneous 1-click addition/removal in Redux with seamless background synchronization to the Supabase database.
- **Graceful Offline & Demo Fallback**: Works effortlessly in full local storage mode if Supabase is not yet configured, with instant 1-click evaluator login.
- **In-App Cloud Configurator**: Evaluators can enter custom Supabase project credentials in the Settings modal with live connectivity verification and copy-pasteable PostgreSQL schema scripts.

### 4. API Integration (The Movie Database - TMDb)
Referenced from: `https://developer.themoviedb.org/reference/getting-started`
- **Real-Time TMDb v3 Integration**:
  - Trending movies: `GET /3/trending/movie/{time_window}` (day/week)
  - Trending series: `GET /3/trending/tv/{time_window}` (day/week)
  - Now playing in theaters: `GET /3/movie/now_playing`
  - Top rated films: `GET /3/movie/top_rated`
  - Popular films: `GET /3/movie/popular`
  - Movie search: `GET /3/search/movie` with pagination
  - Detailed metadata & credits: `GET /3/movie/{id}?append_to_response=videos,credits,similar,release_dates`
  - Discover & filter: `GET /3/discover/movie` with `with_genres`, `primary_release_year`, `vote_average.gte`, `vote_count.gte`, and `sort_by`
  - Genres list: `GET /3/genre/movie/list`
- **Axios Client**: Configured with request interceptors for automated API key injection, 10s timeout, and unified error handling.
- **Real-Time TMDb Endpoints**: All catalog data, trailers, and cast credits are queried live from TMDb. If an error occurs (such as an invalid API key or network interruption), standard resilient error boundaries and informative alerts are presented.
- **In-App API Key Manager**: Evaluators can open Settings to test or paste their own personal TMDb API key with live verification feedback.

### 5. Search & Bonus Features
- **Instant Search with Debounce**: 450ms debounce mechanism preventing wasteful API calls.
- **Search History Persistence**: The user's last searched movie is automatically stored in `localStorage` and displayed as a clickable chip for 1-tap restore.
- **Infinite Scrolling & "Load More" Toggle**: Built-in `IntersectionObserver` sentinel for seamless infinite scrolling, with a toggle to switch to a **"Load More"** button mode for alternative UX.
- **Comprehensive TMDb Discover Filtering**: Filter movies by **Genre**, **Release Year** (2018–2026), and **Minimum Rating** (⭐ 8.0+, 7.0+, 6.0+), alongside sorting by popularity, rating, or release date.
- **YouTube Video Trailer Player**: Integrated 16:9 cinematic YouTube video player modal playing trailers and teasers fetched directly from TMDb videos endpoint.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-driven UI library |
| **Supabase (@supabase/supabase-js)** | PostgreSQL cloud database for user Watchlist and JWT authentication |
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
├── supabase/
│   └── schema.sql            # PostgreSQL table schema & RLS policies
├── src/
│   ├── api/
│   │   ├── axiosClient.js        # Configured Axios instance with interceptors
│   │   └── tmdbApi.js            # Pure TMDb API v3 service endpoints
│   ├── app/
│   │   └── store.js              # Redux store configuration
│   ├── services/
│   │   └── supabaseClient.js     # Supabase client, Auth, and DB functions
│   ├── features/
│   │   ├── auth/                 # Supabase authentication state & thunks
│   │   ├── favorites/            # Watchlist with Supabase cloud DB sync & local storage
│   │   ├── movies/               # Trending, Search, Filters, Details, Trailers
│   │   ├── settings/             # Custom API key, Supabase config & user preferences
│   │   └── theme/                # Dark/Light theme mode state
│   ├── components/
│   │   ├── common/
│   │   │   ├── GlassNavbar.jsx   # Top floating capsule navigation
│   │   │   ├── MobileBottomNav.jsx # Mobile floating glass dock
│   │   │   ├── GlassButton.jsx   # Pill & circular glass action buttons
│   │   │   ├── RatingBadge.jsx   # Golden star rating badge
│   │   │   ├── TmdbAttribution.jsx # Official TMDb developer attribution badge
│   │   │   └── LoadingSkeleton.jsx # Glass shimmer skeletons
│   │   ├── movie/
│   │   │   ├── MovieCard.jsx     # Reusable poster card with 1-click favorite
│   │   │   ├── MovieRow.jsx      # Horizontal carousel with chevron navigation
│   │   │   ├── MovieGrid.jsx     # Mobile-first responsive poster grid
│   │   │   ├── MovieDetailsModal.jsx # Interactive details sheet matching Figma
│   │   │   └── TrailerModal.jsx  # 16:9 YouTube video embed dialog
│   │   ├── hero/
│   │   │   └── HeroBanner.jsx    # Cinematic full-bleed backdrop hero
│   │   ├── search/
│   │   │   ├── SearchBar.jsx     # Debounced input with last search chip
│   │   │   └── FilterBar.jsx     # Genre, year, rating, and sort controls
│   │   ├── auth/
│   │   │   └── LoginModal.jsx    # Supabase Auth dialog (Sign in & Sign up)
│   │   └── settings/
│   │       └── SettingsModal.jsx # TMDb & Supabase tester & configuration modal
│   ├── pages/
│   │   ├── HomePage.jsx          # Hero + Trending + Now Playing + Top Rated
│   │   ├── MoviesPage.jsx        # Explore movies with full filter bar & grid
│   │   ├── SeriesPage.jsx        # TV series collection
│   │   ├── SearchPage.jsx        # Search with infinite scroll / load more
│   │   ├── FavoritesPage.jsx     # Cloud-synced Watchlist with Supabase indicator
│   │   ├── MovieDetailsPage.jsx  # Dedicated deep-linkable movie page (/movie/:id)
│   │   ├── LoginPage.jsx         # Dedicated full-page login & registration route
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

1. **Test Supabase Authentication & Sign Up**:
   - Click the user icon in the top navbar or navigate to `/login`.
   - Switch between **"Sign In"** and **"Create Account"** tabs.
   - Or click **"1-Click Evaluator Login"** to immediately authenticate as a test user.
   - When authenticated, notice the user capsule displays your display name and role.
2. **Test Supabase Watchlist & Database Sync**:
   - Click the `(+)` button on any movie poster (or inside the details sheet).
   - Navigate to **"List"** (`/favorites`) in the top navigation.
   - Notice the green badge indicating your library is synced with Supabase Cloud DB.
   - Items update optimistically and persist across browser reloads and devices.
3. **Test In-App Supabase & TMDb Configurator**:
   - Click the Settings gear icon in the navbar.
   - You can view the pre-formatted PostgreSQL SQL schema script with Row-Level Security (RLS) policies.
   - You can test live database connectivity or enter custom Supabase project credentials.
4. **Test Search & Debounce Persistence**:
   - Go to Search (`/search`). Type `"Spider-Man"` or `"Avengers"`.
   - Refresh the page: notice your last search query is preserved and rendered as a quick-filter chip.
5. **Test Infinite Scroll vs. Load More**:
   - In Search, toggle the **"Infinite Scroll Active"** switch to test both infinite scroll and manual **"Load More"** button mode.
6. **Test Interactive Details Sheet & YouTube Trailer**:
   - Click any movie poster to open the interactive details sheet matching the Figma design specifications.
   - Click **"Watch Trailer"** to play the real YouTube trailer retrieved from TMDb.
7. **Test Light / Dark Mode**:
   - Click the sun/moon icon in the top floating capsule to toggle between dark glass and light frosted glass.

---

*Developed for the Loon Labs Software Engineering Interview Assessment.*
