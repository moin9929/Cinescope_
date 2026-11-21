let watchlist = JSON.parse(localStorage.getItem("cineScopeWatchlist")) || [];

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.add("hidden");
    }, 2800);
}

function updateWatchlistBadge() {
    const badge = document.getElementById("watchlistCount");
    if (badge) badge.textContent = watchlist.length;
}

function saveWatchlist() {
    localStorage.setItem("cineScopeWatchlist", JSON.stringify(watchlist));
    updateWatchlistBadge();
}

function isInWatchlist(movieId) {
    return watchlist.some(item => item.id === Number(movieId));
}

function toggleWatchlist(movieId) {
    const id = Number(movieId);
    const movie = movies.find(item => item.id === id);
    if (!movie) return;

    if (isInWatchlist(id)) {
        watchlist = watchlist.filter(item => item.id !== id);
        saveWatchlist();
        renderWatchlist();
        if (typeof displayMovies === "function") displayMovies();
        if (typeof displayTrendingMovies === "function") displayTrendingMovies();
        showToast(`Removed "${movie.title}" from Watchlist`);
    } else {
        watchlist.push(movie);
        saveWatchlist();
        renderWatchlist();
        if (typeof displayMovies === "function") displayMovies();
        if (typeof displayTrendingMovies === "function") displayTrendingMovies();
        showToast(`❤️ Added "${movie.title}" to Watchlist`);
    }
}

function removeFromWatchlist(movieId) {
    watchlist = watchlist.filter(movie => movie.id !== Number(movieId));
    saveWatchlist();
    renderWatchlist();
    if (typeof displayMovies === "function") displayMovies();
    if (typeof displayTrendingMovies === "function") displayTrendingMovies();
    showToast("Removed from Watchlist");
}

function renderWatchlist() {
    const watchlistItems = document.getElementById("watchlistItems");
    updateWatchlistBadge();

    if (watchlist.length === 0) {
        watchlistItems.innerHTML = `
            <p class="empty-message">
                Your watchlist is empty. Click the ❤️ icon on any movie or series to save it here!
            </p>
        `;
        return;
    }

    watchlistItems.innerHTML = watchlist.map(movie => `
        <div class="movie-card" data-id="${movie.id}">
            <div class="poster-container">
                <img
                    src="${movie.poster}"
                    alt="${movie.title}"
                    loading="lazy"
                    onerror="this.src='https://placehold.co/400x600/222229/ffffff?text=No+Poster'"
                >
                <span class="movie-rating">⭐ ${movie.rating}</span>
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.year} · ${movie.genre}</p>
                <button class="remove-btn" data-remove-id="${movie.id}">
                    Remove
                </button>
            </div>
        </div>
    `).join("");
}

document.getElementById("watchlistItems").addEventListener("click", function(event) {
    const removeButton = event.target.closest("[data-remove-id]");
    if (removeButton) {
        event.stopPropagation();
        removeFromWatchlist(Number(removeButton.dataset.removeId));
    }
});