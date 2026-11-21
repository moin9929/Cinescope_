
// ==========================================
// 1. TMDB API CONFIGURATION
// ==========================================

// Get your API key from TMDB developer settings.

const API_KEY = "YOUR_TMDB_API_KEY";

const BASE_URL = "https://api.themoviedb.org/3";

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";


// ==========================================
// 2. COMMON API FUNCTION
// ==========================================

async function fetchTMDB(endpoint) {

    try {

        const response = await fetch(
            `${BASE_URL}${endpoint}`,
            {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );


        if (!response.ok) {

            throw new Error("Unable to fetch movie data");

        }


        const data = await response.json();

        return data;

    }

    catch (error) {

        console.error("TMDB API Error:", error);

        return null;

    }

}


// ==========================================
// 3. GET TRENDING MOVIES
// ==========================================

async function getTrendingMovies() {

    const data = await fetchTMDB(
        "/trending/movie/week"
    );

    return data ? data.results : [];

}


// ==========================================
// 4. GET POPULAR MOVIES
// ==========================================

async function getPopularMovies() {

    const data = await fetchTMDB(
        "/movie/popular"
    );

    return data ? data.results : [];

}


// ==========================================
// 5. GET POPULAR WEB SERIES
// ==========================================

async function getPopularSeries() {

    const data = await fetchTMDB(
        "/tv/popular"
    );

    return data ? data.results : [];

}


// ==========================================
// 6. SEARCH MOVIES
// ==========================================

async function searchTMDBMovies(query) {

    const data = await fetchTMDB(
        `/search/movie?query=${encodeURIComponent(query)}`
    );

    return data ? data.results : [];

}


// ==========================================
// 7. GET MOVIE DETAILS
// ==========================================

async function getMovieDetails(movieId) {

    return await fetchTMDB(
        `/movie/${movieId}?append_to_response=credits,videos`
    );

}


// ==========================================
// 8. CONVERT POSTER PATH TO IMAGE URL
// ==========================================

function getPosterURL(posterPath) {

    if (!posterPath) {

        return "https://placehold.co/400x600/222229/ffffff?text=No+Poster";

    }

    return IMAGE_URL + posterPath;

}
