import fetch from 'node-fetch';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_BASE = 'https://api.themoviedb.org/3';

// Helper to fetch JSON from TMDB endpoint
async function fetchFromTMDB(endpoint) {
    const url = `${TMDB_API_BASE}${endpoint}&api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.statusText}`);
    }
    return await response.json();
}

// Fetch popular movies from TMDB
export async function fetchPopularMovies() {
    // Fetch popular movies list
    const popularData = await fetchFromTMDB('/movie/popular?language=en-US&page=1');
    const movies = [];

    for (const movie of popularData.results) {
        // Fetch additional details per movie
        const movieDetails = await fetchFromTMDB(`/movie/${movie.id}?language=en-US&append_to_response=credits`);
        const { id, title, overview, poster_path, backdrop_path, release_date, original_language, tagline, genres, runtime, vote_average, vote_count, credits } = movieDetails;

        // Map casts
        const casts = credits && credits.cast ? credits.cast.slice(0, 10).map(c => ({
            name: c.name,
            profile_path: c.profile_path ? `https://image.tmdb.org/t/p/original${c.profile_path}` : ''
        })) : [];

        movies.push({
            _id: id.toString(),
            id,
            title,
            overview,
            poster_path: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : '',
            backdrop_path: backdrop_path ? `https://image.tmdb.org/t/p/original${backdrop_path}` : '',
            genres: genres.map(g => ({ id: g.id, name: g.name })),
            casts,
            release_date,
            original_language,
            tagline: tagline || '',
            vote_average,
            vote_count,
            runtime: runtime || 0,
        });
    }

    return movies;
}
