const apiBaseUrl = "https://api.themoviedb.org/3";
const apiKey = "d209329cce0ab919c1772a0552d0ea65";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";

const moviesGrid = document.getElementById("movies-grid");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const categoryTitle = document.getElementById("category-title");


  

async function fetchMoviesNowPlaying() {
    const response = await fetch(`${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`);
    const jsonResponse = await response.json();
    const movies = await Promise.all(
        jsonResponse.results.map(async (result) => ({
            id: result.id,
            title: result.title,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id),
        }))
    );
    displayMovies(movies);
}

async function searchMovies(query) {
    const response = await fetch(`${apiBaseUrl}/search/movie?api_key=${apiKey}&query=${query}`);
    const jsonResponse = await response.json();
    const movies = await Promise.all(
        jsonResponse.results.map(async (result) => ({
            id: result.id,
            title: result.title,
            poster_path: result.poster_path,
            vote_average: result.vote_average,
            IMDbId: await getIMDbId(result.id),
        }))
    );
    displayMovies(movies);
}

function displayMovies(movies) {
    moviesGrid.innerHTML = movies
        .map(
            (movie) =>
                `<div class="movie-card">
                    <a href="https://www.imdb.com/title/${movie.IMDbId}/">
                        <img src="${imageBaseUrl}${movie.poster_path}"/>
                        <p>⭐ ${movie.vote_average}</p>
                        <h1>${movie.title}<h1/>
                    </a>
                 </div>`
        )
        .join("");
}

function handleSearchFormSubmit(event) {
    event.preventDefault();
    categoryTitle.innerHTML = "Search Results";
    const searchQuery = searchInput.value;
    searchMovies(searchQuery);
}

async function getIMDbId(movieId) {
    const response = await fetch(`${apiBaseUrl}/movie/${movieId}/external_ids?api_key=${apiKey}`);
    const jsonResponse = await response.json();
    const IMDbId = jsonResponse.imdb_id;
    return IMDbId;
}
// script.js

// Add an event listener to the "View Movies Watched" button
document.getElementById("movies-watched-btn").addEventListener("click", function () {
    // Hide the search bar and show the movies watched table
    document.getElementById("search-bar").style.display = "none";
    document.getElementById("movies-watched-table").style.display = "block";
});

// Add an event listener to the "Add Movie" button
document.getElementById("add-movie-btn").addEventListener("click", function () {
    // Get the movie title and year inputs
    const movieTitle = document.getElementById("movie-title-input").value;
    const movieYear = document.getElementById("movie-year-input").value;

    // Create a new table row and cells for the movie data
    const table = document.getElementById("movies-watched-body");
    const newRow = table.insertRow();
    const titleCell = newRow.insertCell(0);
    const yearCell = newRow.insertCell(1);

    // Set the movie data in the table cells
    titleCell.innerHTML = movieTitle;
    yearCell.innerHTML = movieYear;

    // Clear the input fields after adding the movie
    document.getElementById("movie-title-input").value = "";
    document.getElementById("movie-year-input").value = "";
});

searchForm.addEventListener("submit", handleSearchFormSubmit);
fetchMoviesNowPlaying();
