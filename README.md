# 🍿 CinePop — Modern Cinema Explorer

> **Submission for Loon Labs — Stage 2 Interview Assessment**  
> *Crafted with React 19, Redux Toolkit, Material-UI (MUI), React Router v7, Supabase Cloud Database & Auth, and the official TMDb API v3.*  
> *Engineered following Modern Glassmorphism Architecture, Mobile-First Responsive Design Principles, and Enterprise Web Security Standards.*  
> 
> 🔗 **Repository**: [https://github.com/ahiru60/loon-labs-movie-explorer](https://github.com/ahiru60/loon-labs-movie-explorer)  
> 🌐 **Live Demo (Vercel)**: Configured for automated Git deployment via `vercel.json`

---

## 🌟 Overview & Highlights

**CinePop** is a modern, production-grade cinema exploration web platform designed with a sleek glassmorphic aesthetic. It connects to **The Movie Database (TMDb) API v3** for real-time movie and television catalog exploration, paired with a **Supabase PostgreSQL** cloud backend for user authentication and synchronized watchlists.

### Core Architecture Highlights
- **Modern Glassmorphic UI**: Frosted glass capsules, translucent cards, subtle borders, backdrop blurs (`backdrop-filter: blur(28px)`), and cohesive dark/light mode tokens.
- **Direct Real-Time TMDb Integration**: Zero mock data; live endpoints provide trending movies, theatrical releases, top-rated classics, official YouTube trailers, genres, and cast metadata.
- **Supabase Cloud Database & Auth**: PostgreSQL database table (`public.favorites`) with Row-Level Security (RLS) policies, JWT session persistence, and seamless offline `localStorage` fallback.
- **Enterprise Web Security**: Zero hardcoded secrets, Content Security Policy (CSP) headers, input sanitization, parameterized queries (SQLi prevention), and strictly encapsulated environment variables.
- **Normalized Geometry**: Mathematically locked carousel items with proportional 2:3 aspect ratio posters and zero Cumulative Layout Shift (CLS).

---

## 🚀 Features Implemented

### 1. User Interface & Responsive Design
- **Floating Glass Capsule Navbar**: Top floating navigation capsule with brand Popcorn logo, view transitions (`Home`, `Movies`, `Series`, `Discover`, `List`), search shortcut, notification badge, and dark/light mode toggle.
- **Mobile-First Bottom Dock**: Ergonomic floating glass pill dock on mobile devices (`Home`, `Movies`, `Search`, `My List`, `Account`) for natural thumb navigation.
- **Cinematic Hero Banner**: Full-bleed backdrop showcasing live top trending films with multi-stop dark gradients, release year, runtime, IMDb score badge, synopsis, and action buttons (`▶ Watch Trailer`, `(+) Watchlist`).
- **Normalized Poster Cards**: 16px rounded-corner cards with smooth hover elevation (`scale(1.03)` + glow shadow), golden rating badge, truncated titles with hover tooltips, and 1-click `(+)` / `(✓)` watchlist toggle.
- **Interactive Movie Details Modal**: Deep-dive details sheet featuring high-res backdrop header, category tags, IMDb score, certification badge, full synopsis, and top-billed cast headshots. Equipped with custom sleek scrollbars so content never cuts off.
- **Cinematic YouTube Trailer Modal**: Responsive 16:9 YouTube video player dialog playing trailers and teasers retrieved directly from TMDb videos endpoint.
- **Light & Dark Mode**: One-click theme toggle switching between deep midnight glass (`#07080c`) and frosted slate light glass (`#f5f7fb`).

### 2. Search & Discovery
- **Instant Search with Debounce**: 450ms debounce mechanism preventing wasteful API calls while typing.
- **Search History Persistence**: The user's last searched movie is stored in `localStorage` and displayed as a clickable chip for 1-tap restore.
- **Infinite Scrolling & "Load More" Toggle**: Built-in `IntersectionObserver` sentinel for seamless infinite scrolling, with a toggle to switch to a manual **"Load More"** button mode.
- **Comprehensive TMDb Discover Filtering**: Multi-criteria discovery engine supporting:
  - **Genre filter**: Dynamic dropdown hydrated by official TMDb genre taxonomy (`/genre/movie/list`).
  - **Release Year filter**: Curated years (2018–2026).
  - **Minimum Rating filter**: Star rating tiers (⭐ 8.0+, 7.0+, 6.0+).
  - **Sort options**: Popularity, Rating, or Release Date.

### 3. State Management & Offline Resilience (Redux Toolkit)
The application manages its entire data flow via **Redux Toolkit** with modular slices:
- `moviesSlice`: Manages live trending movies, now playing in theaters, top-rated classics, popular releases, TV series, official TMDb genres, search queries, pagination, movie details, active trailers, and discover filter parameters.
- `favoritesSlice`: Manages user Watchlist with optimistic UI updates, background Supabase PostgreSQL synchronization, and offline `localStorage` fallback.
- `authSlice`: Handles user credentials, Supabase JWT session verification, token refresh listener, and 1-click demo evaluation login.
- `themeSlice`: Persists user's dark/light preference across browser sessions.
- `settingsSlice`: In-app notification center state.

### 4. Enterprise Security Standards
- **Secret Isolation**: Zero secrets or API keys are stored in source code or tracked in Git. All credentials strictly read from `import.meta.env.VITE_*`.
- **Content Security Policy (CSP)**: Enterprise meta tags restricting scripts, styles, fonts, frames (YouTube), images (TMDb, Unsplash), and backend connect origins (TMDb, Supabase).
- **SQL Injection Prevention**: Supabase query builder uses parameterized queries exclusively, coupled with Postgres Row-Level Security (`auth.uid() = user_id`).
- **Input Sanitization**: Zero-dependency validation utility (`src/utils/validation.js`) sanitizing search strings, emails, passwords, and entity IDs before dispatching network requests.
- **Error Shielding**: Raw database errors and internal schemas are sanitized before display; end users receive helpful, friendly error notices.

---

## 🔌 API Usage & Integration

### 1. The Movie Database (TMDb) API v3
*Reference: [developer.themoviedb.org/reference/getting-started](https://developer.themoviedb.org/reference/getting-started)*

All movie catalog data, images, cast credits, and trailers are queried in real time:

| Endpoint | HTTP Method | Usage in CinePop |
| :--- | :--- | :--- |
| `/trending/movie/{time_window}` | `GET` | Featured Hero banner and Trending Movies carousel (supports `day` and `week` toggle) |
| `/trending/tv/{time_window}` | `GET` | Trending TV Series carousel |
| `/movie/now_playing` | `GET` | Now Playing in Theaters carousel |
| `/movie/top_rated` | `GET` | Top Rated Classics carousel |
| `/movie/popular` | `GET` | Popular Movies catalog |
| `/search/movie` | `GET` | Debounced movie search with query string and pagination |
| `/discover/movie` | `GET` | Multi-parameter filtering by genre, release year, minimum rating, and sort order |
| `/movie/{id}` | `GET` | Hydrated movie details (using `append_to_response=videos,credits,similar,release_dates`) |
| `/tv/{id}` | `GET` | Hydrated television series metadata (using `append_to_response=videos,credits,content_ratings`) |
| `/genre/movie/list` | `GET` | Official TMDb genre taxonomy for category badges and filter dropdowns |

#### Axios Client Architecture ([src/api/axiosClient.js](file:///d:/1.%20Study/Projects/Loon%20labs/src/api/axiosClient.js))
- **Automated Parameter Injection**: Request interceptor automatically appends `api_key` strictly from environment configuration (`import.meta.env.VITE_TMDB_API_KEY`).
- **Resilience**: 10-second request timeout with graceful network error normalization.
- **Security**: Strips sensitive authorization headers from outgoing error objects to prevent credential leakage.

---

### 2. Supabase Cloud Database & Authentication
*Reference: [supabase.com/docs](https://supabase.com/docs)*

| Service | Method / Query | Usage in CinePop |
| :--- | :--- | :--- |
| **Auth** | `supabase.auth.signUp()` | Register new account with email, password, and display name metadata |
| **Auth** | `supabase.auth.signInWithPassword()` | Authenticate existing user with email and password |
| **Auth** | `supabase.auth.signOut()` | Invalidate active session and clear local tokens |
| **Auth** | `supabase.auth.onAuthStateChange()` | Global listener for `SIGNED_IN`, `SIGNED_OUT`, and `TOKEN_REFRESHED` events |
| **Database** | `.from('favorites').select('*')` | Retrieve authenticated user's saved watchlist sorted by `created_at DESC` |
| **Database** | `.from('favorites').upsert(...)` | Save movie to watchlist with conflict resolution (`onConflict: 'user_id,movie_id'`) |
| **Database** | `.from('favorites').delete()` | Remove movie from watchlist matching `user_id` and `movie_id` |

#### PostgreSQL Table Schema & RLS ([supabase/schema.sql](file:///d:/1.%20Study/Projects/Loon%20labs/supabase/schema.sql))
```sql
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    backdrop_path TEXT,
    vote_average NUMERIC(3, 1) DEFAULT 0,
    release_date TEXT,
    overview TEXT,
    media_type TEXT DEFAULT 'movie',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_movie UNIQUE (user_id, movie_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);
```

---

## ⚡ Project Setup & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or `pnpm` / `yarn`)
- **TMDb Account**: API v3 Read Key (free from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))
- **Supabase Account (Optional)**: Free project from [supabase.com](https://supabase.com)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/ahiru60/loon-labs-movie-explorer.git
cd loon-labs-movie-explorer
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the project root based on [.env.example](file:///d:/1.%20Study/Projects/Loon%20labs/.env.example):
```env
# The Movie Database (TMDb) API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p

# Supabase Cloud Database & Authentication (Optional)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
```

### Step 4: Initialize Supabase Database (If using Supabase)
1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab.
3. Paste the contents of [supabase/schema.sql](file:///d:/1.%20Study/Projects/Loon%20labs/supabase/schema.sql) and click **Run**.
4. The `public.favorites` table and Row-Level Security policies are now ready.

### Step 5: Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

### Step 6: Build for Production
```bash
npm run build
npm run preview
```
The compiled, minified production assets will be generated in `dist/`.

---

## 🌐 Vercel Deployment Guide (CI/CD from Git)

This project includes a pre-configured [vercel.json](file:///d:/1.%20Study/Projects/Loon%20labs/vercel.json) that enables Single-Page Application (SPA) rewrite rules so that React Router v7 routes (`/movies`, `/series`, `/search`, `/favorites`, `/movie/:id`) work seamlessly without 404 errors.

### 1-Click Git Deployment Steps:
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New…** $\rightarrow$ **Project**.
3. Under **Import Git Repository**, select **`ahiru60/loon-labs-movie-explorer`** and click **Import**.
4. Vercel automatically detects the **Vite** preset:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - `VITE_TMDB_API_KEY`: Your TMDb API key.
   - `VITE_SUPABASE_URL`: Your Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key.
6. Click **Deploy**. Vercel will build and assign your production URL in ~30 seconds.

---

## 📂 Project Structure

```
loon-labs/
├── public/                       # Static public assets
├── supabase/
│   └── schema.sql                # PostgreSQL table schema & Row-Level Security (RLS) policies
├── src/
│   ├── api/
│   │   ├── axiosClient.js        # Configured Axios instance with request interceptors & sanitization
│   │   └── tmdbApi.js            # Pure TMDb API v3 service endpoints
│   ├── app/
│   │   └── store.js              # Redux store configuration with combined slice reducers
│   ├── services/
│   │   └── supabaseClient.js     # Supabase client, Auth methods, and favorites DB operations
│   ├── features/
│   │   ├── auth/                 # Supabase authentication state & async thunks
│   │   ├── favorites/            # Watchlist slice with Supabase DB sync & local storage persistence
│   │   ├── movies/               # Trending, Search, Filters, Details, and Trailer player slice
│   │   ├── settings/             # Notifications state slice
│   │   └── theme/                # Dark/Light theme mode state slice
│   ├── components/
│   │   ├── common/
│   │   │   ├── GlassNavbar.jsx   # Top floating capsule navigation with brand Popcorn logo
│   │   │   ├── MobileBottomNav.jsx # Mobile floating glass dock
│   │   │   ├── PopcornIcon.jsx   # Custom high-resolution vector Popcorn brand icon
│   │   │   ├── GlassButton.jsx   # Pill & circular translucent action buttons
│   │   │   ├── RatingBadge.jsx   # Golden star rating badge
│   │   │   ├── TmdbAttribution.jsx # Official TMDb developer attribution badge
│   │   │   └── LoadingSkeleton.jsx # Responsive glass shimmer skeleton placeholders
│   │   ├── movie/
│   │   │   ├── MovieCard.jsx     # Reusable poster card with 1-click favorite & locked dimensions
│   │   │   ├── MovieRow.jsx      # Horizontal carousel with chevron navigation & zero layout shift
│   │   │   ├── MovieGrid.jsx     # Responsive poster grid (2 to 6 columns)
│   │   │   ├── MovieDetailsModal.jsx # Interactive details sheet with sleek custom scrollbars
│   │   │   └── TrailerModal.jsx  # 16:9 YouTube video embed dialog
│   │   ├── hero/
│   │   │   └── HeroBanner.jsx    # Cinematic full-bleed backdrop hero with auto-advancing carousel
│   │   ├── search/
│   │   │   ├── SearchBar.jsx     # Debounced input with last search chip
│   │   │   └── FilterBar.jsx     # Genre, year, rating, and sort controls
│   │   └── auth/
│   │       └── LoginModal.jsx    # Supabase Auth dialog (Sign In & Sign Up tabs)
│   ├── pages/
│   │   ├── HomePage.jsx          # Hero Banner + Trending + Now Playing + Top Rated carousels
│   │   ├── MoviesPage.jsx        # Explore movies with full filter bar & poster grid
│   │   ├── SeriesPage.jsx        # TV series collection
│   │   ├── SearchPage.jsx        # Search with infinite scroll / load more toggle
│   │   ├── FavoritesPage.jsx     # Cloud-synced Watchlist with Supabase sync badge
│   │   ├── MovieDetailsPage.jsx  # Dedicated deep-linkable movie page (/movie/:id)
│   │   ├── LoginPage.jsx         # Dedicated full-page authentication route (/login)
│   │   └── NotFoundPage.jsx      # 404 page with return CTA
│   ├── theme/
│   │   └── theme.js              # MUI custom design tokens (Dark & Light glass)
│   ├── utils/
│   │   ├── helpers.js            # Image URLs, runtime, and date formatters
│   │   ├── localStorage.js       # Safe localStorage serialization utilities
│   │   └── validation.js         # Input validation & XSS sanitization engine
│   ├── App.jsx                   # Layout, router configuration, and global modal hosts
│   ├── index.css                 # Global glassmorphism utilities & custom scrollbar styles
│   └── main.jsx                  # Root entry with Redux Provider & Router
├── .env.example                  # Environment variable template
├── vercel.json                   # Vercel SPA client-side routing rewrite rules
├── package.json                  # Dependencies & scripts
└── vite.config.js                # Vite build and development configuration
```

---

## 🧪 Evaluator Verification Guide

1. **Test Real-Time TMDb Data Loading**:
   - Navigate through **Home**, **Movies**, and **Series**.
   - Notice that all titles, backdrops, ratings, and release years are fetched live from TMDb.
   - Use the time window toggle on the **Trending Movies** row to switch between **"This Week"** and **"Today"**.
2. **Test Normalized Card Dimensions**:
   - Inspect cards with unusually long titles (e.g., *"Demon Slayer: Kimetsu no Yaiba Infinity Castle"* or *"Chainsaw Man"*).
   - Notice that all cards maintain an identical width and 2:3 poster height, with long titles truncated cleanly via ellipsis and readable via hover tooltips.
3. **Test Movie Details Sheet & YouTube Trailer**:
   - Click any movie poster to open the interactive details sheet.
   - Scroll through the sheet: notice the sleek custom scrollbar that gracefully displays the full synopsis and cast without cutting off content.
   - Click **"Watch Trailer"** to launch the 16:9 YouTube video embed.
4. **Test Instant Search & Filter Bar**:
   - Go to **Search** (`/search`). Type `"Inception"` or `"Batman"`. Notice the 450ms debounce in action.
   - Refresh the page: your last search term is preserved as a 1-tap chip.
   - Toggle **"Infinite Scroll Active"** to test both infinite scroll sentinel loading and manual **"Load More"** pagination.
   - Go to **Movies** (`/movies`) and test the **Filter Bar**: combine **Genre: Animation**, **Year: 2024**, and **Rating: ⭐ 8.0+**.
5. **Test Watchlist & Supabase Cloud Sync**:
   - Click the `(+)` watchlist button on any card.
   - Navigate to **"List"** (`/favorites`).
   - If Supabase is connected, the green **"Cloud Synced"** chip is active and changes persist to PostgreSQL.
   - If offline or unconfigured, the app falls back seamlessly to `localStorage`.
6. **Test Authentication**:
   - Click the profile icon in the navbar or navigate to `/login`.
   - Test registration or use the **"1-Click Evaluator Login"** button for instant session creation.
7. **Test Light & Dark Mode**:
   - Click the sun/moon icon in the top floating capsule to switch between dark glass and light frosted glass.

---

## 🛠️ Tech Stack Summary

| Technology | Role |
| :--- | :--- |
| **React 19** | Component-based UI layer |
| **Vite v8** | High-speed build tool and development server |
| **Redux Toolkit & React-Redux** | Predictable global state management with persistent slices |
| **Material-UI (MUI v6 / v9)** | Design tokens, typography, and foundational components |
| **React Router v7** | Declarative client-side routing |
| **Supabase Client (`@supabase/supabase-js`)** | PostgreSQL database connectivity, Auth, and Row-Level Security |
| **Axios** | HTTP client with automated parameter injection and error normalization |
| **The Movie Database (TMDb) API v3** | Real-time cinematic data, posters, and YouTube video trailers |
| **Vercel** | Automated continuous deployment platform with SPA rewrite handling |

---

*Engineered with precision for the Loon Labs Software Engineering Assessment.*
