// ==========================================
// 1. SELECT HTML ELEMENTS
// ==========================================
const trendingMovies = document.getElementById("trendingMovies");
const movieList = document.getElementById("movieList");
const seriesList = document.getElementById("seriesList");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");

const genreFilter = document.getElementById("genreFilter");
const sortFilter = document.getElementById("sortFilter");
const loadMoreBtn = document.getElementById("loadMore");

const movieModal = document.getElementById("movieModal");
const movieDetails = document.getElementById("movieDetails");
const closeModal = document.getElementById("closeModal");

const exploreBtn = document.getElementById("exploreBtn");
const exploreSeriesBtn = document.getElementById("exploreSeriesBtn");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

// ==========================================
// 2. GLOBAL STATE
// ==========================================
let searchTerm = "";
let selectedGenre = "all";
let selectedSort = "default";
let visibleMovies = 5;

// ==========================================
// 3. CREATE MOVIE / SERIES CARD
// ==========================================
function createMovieCard(movie) {
    const saved = isInWatchlist(movie.id);
    const typeClass = movie.type === "series" ? "type-series" : "type-movie";

    return `
        <div class="movie-card" data-id="${movie.id}">
            <div class="poster-container">
                <img
                    src="${movie.poster}"
                    alt="${movie.title}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/400x600/191c2b/ffffff?text=${encodeURIComponent(movie.title)}'"
                >
                <span class="movie-rating">⭐ ${movie.rating}</span>
                <span class="age-badge">${movie.ageRating || "PG"}</span>

                <button
                    class="watch-btn ${saved ? "in-watchlist" : ""}"
                    data-watch-id="${movie.id}"
                    title="${saved ? "Remove from Watchlist" : "Add to Watchlist"}">
                    ${saved ? "❤️" : "🤍"}
                </button>

                <div class="play-overlay">
                    <div class="play-circle" title="Watch Trailer">▶</div>
                </div>
            </div>

            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.year} · ${movie.duration}</p>
                <div class="card-tags">
                    <span class="movie-type ${typeClass}">${movie.type.toUpperCase()}</span>
                    <span class="genre-pill">${movie.genre}</span>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// 4. RENDER CARDS
// ==========================================
function renderMovieCards(movieArray, container, emptyText = "No matching titles found!") {
    if (movieArray.length === 0) {
        container.innerHTML = `<p class="empty-message">${emptyText}</p>`;
        return;
    }
    container.innerHTML = movieArray.map(createMovieCard).join("");
}

// ==========================================
// 5. DISPLAY TRENDING (TOP RATED)
// ==========================================
function displayTrendingMovies() {
    const trending = [...movies]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    renderMovieCards(trending, trendingMovies);
}

// ==========================================
// 6. FILTER & SORT
// ==========================================
function getFilteredMovies() {
    let filtered = movies.filter(movie => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
            movie.title.toLowerCase().includes(query) ||
            movie.genre.toLowerCase().includes(query) ||
            (movie.cast && movie.cast.toLowerCase().includes(query));

        const matchesGenre =
            selectedGenre === "all" || movie.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    });

    if (selectedSort === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === "year") {
        filtered.sort((a, b) => b.year - a.year);
    }

    return filtered;
}

// ==========================================
// 7. DISPLAY MOVIES AND SERIES
// ==========================================
function displayMovies() {
    const filtered = getFilteredMovies();
    const onlyMovies = filtered.filter(item => item.type === "movie");
    const onlySeries = filtered.filter(item => item.type === "series");

    const visibleMovieList = onlyMovies.slice(0, visibleMovies);

    renderMovieCards(visibleMovieList, movieList, "No movies match your filter.");
    renderMovieCards(onlySeries, seriesList, "No web series match your filter.");

    loadMoreBtn.style.display = onlyMovies.length > visibleMovies ? "inline-block" : "none";
}

// ==========================================
// 8. SEARCH, FILTER & PAGINATION EVENTS
// ==========================================
function handleSearch() {
    searchTerm = searchInput.value.trim();
    clearSearchBtn.classList.toggle("hidden", searchTerm.length === 0);
    visibleMovies = 5;
    displayMovies();
}

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("input", handleSearch);

clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    handleSearch();
    searchInput.focus();
});

genreFilter.addEventListener("change", function() {
    selectedGenre = this.value;
    visibleMovies = 5;
    displayMovies();
});

sortFilter.addEventListener("change", function() {
    selectedSort = this.value;
    displayMovies();
});

loadMoreBtn.addEventListener("click", () => {
    visibleMovies += 5;
    displayMovies();
});

// ==========================================
// 9. IN-PAGE VIDEO PLAYER & DETAILS MODAL
// ==========================================
function openMovieDetails(movieId, autoPlayVideo = false) {
    const movie = movies.find(item => item.id === Number(movieId));
    if (!movie) return;

    const saved = isInWatchlist(movie.id);

    const mediaSection = autoPlayVideo && movie.videoId
        ? `
            <div class="video-player-wrapper">
                <iframe
                    src="https://www.youtube.com/embed/${movie.videoId}?autoplay=1&rel=0&modestbranding=1"
                    title="${movie.title} Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
        `
        : `
            <div class="detail-backdrop-wrap" onclick="openMovieDetails(${movie.id}, true)">
                <img
                    src="${movie.backdrop || movie.poster}"
                    alt="${movie.title}"
                    class="detail-backdrop"
                    onerror="this.src='https://placehold.co/800x400/191c2b/ffffff?text=${encodeURIComponent(movie.title)}'"
                >
                <div class="backdrop-play-btn">
                    <span>▶</span>
                    <p>Click to Play Trailer In-Page</p>
                </div>
            </div>
        `;

    movieDetails.innerHTML = `
        ${mediaSection}

        <h2>${movie.title}</h2>
        <p class="detail-meta">
            ⭐ ${movie.rating} / 10 &nbsp;|&nbsp; ${movie.ageRating} &nbsp;|&nbsp; ${movie.year} &nbsp;|&nbsp; ${movie.duration} &nbsp;|&nbsp; ${movie.genre}
        </p>

        <h3 class="detail-section-title">Overview</h3>
        <p>${movie.description}</p>

        <h3 class="detail-section-title">Cast</h3>
        <p>${movie.cast}</p>

        <div class="modal-actions">
            ${!autoPlayVideo ? `
                <button class="primary-btn" onclick="openMovieDetails(${movie.id}, true)">
                    ▶ Play Trailer Now
                </button>
            ` : ""}
            <button class="secondary-btn" onclick="toggleWatchlist(${movie.id}); openMovieDetails(${movie.id}, ${autoPlayVideo});">
                ${saved ? "❤️ Saved in Watchlist" : "🤍 Add to Watchlist"}
            </button>
        </div>
    `;

    movieModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeMovieModal() {
    movieModal.classList.add("hidden");
    movieDetails.innerHTML = ""; // Stops video playback immediately
    document.body.style.overflow = "";
}

document.addEventListener("click", function(event) {
    const watchButton = event.target.closest("[data-watch-id]");
    if (watchButton) {
        event.stopPropagation();
        toggleWatchlist(Number(watchButton.dataset.watchId));
        return;
    }

    // Clicking the center play button launches the video immediately
    const playButton = event.target.closest(".play-circle");
    if (playButton) {
        const card = playButton.closest(".movie-card");
        if (card) {
            event.stopPropagation();
            openMovieDetails(card.dataset.id, true);
            return;
        }
    }

    const movieCard = event.target.closest(".movie-card");
    if (movieCard && !event.target.closest("[data-remove-id]")) {
        openMovieDetails(movieCard.dataset.id, false);
    }
});

closeModal.addEventListener("click", closeMovieModal);
movieModal.addEventListener("click", event => {
    if (event.target === movieModal) closeMovieModal();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !movieModal.classList.contains("hidden")) {
        closeMovieModal();
    }
});

// ==========================================
// 10. NAVIGATION & HERO SCROLL
// ==========================================
exploreBtn.addEventListener("click", () => {
    document.getElementById("movies").scrollIntoView({ behavior: "smooth" });
});

exploreSeriesBtn.addEventListener("click", () => {
    document.getElementById("series").scrollIntoView({ behavior: "smooth" });
});

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
});

// ==========================================
// 11. INITIALIZE
// ==========================================
function initializeWebsite() {
    // Clean any old 18+ items from saved localStorage watchlist
    const validIds = new Set(movies.map(m => m.id));
    watchlist = watchlist.filter(item => validIds.has(item.id));
    saveWatchlist();

    displayTrendingMovies();
    displayMovies();
    renderWatchlist();
}

initializeWebsite();