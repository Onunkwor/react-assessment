import { VITE_MOVIE_DB_KEY } from "@/config/config";

const API_KEY = VITE_MOVIE_DB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Function to fetch movie metrics
export const fetchMovieMetrics = async () => {
  try {
    // Fetch popular movies
    const popularRes = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    const popularData = await popularRes.json();

    // Fetch top-rated movies
    const topRatedRes = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    );
    const topRatedData = await topRatedRes.json();

    // Fetch genres
    const genresRes = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    const genresData = await genresRes.json();

    // Fetch trending movies
    const trendingRes = await fetch(
      `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`
    );
    const trendingData = await trendingRes.json();

    // Calculate average rating
    const averageRating =
      popularData.results.reduce(
        (sum: number, movie: any) => sum + movie.vote_average,
        0
      ) / popularData.results.length;

    // Process genre distribution
    const genreMap: Record<number, string> = {};
    genresData.genres.forEach((genre: any) => {
      genreMap[genre.id] = genre.name;
    });

    const genreDistribution: Record<string, number> = {};
    popularData.results.forEach((movie: any) => {
      movie.genre_ids.forEach((id: number) => {
        const genreName = genreMap[id];
        genreDistribution[genreName] = (genreDistribution[genreName] || 0) + 1;
      });
    });

    return {
      averageRating,
      genreDistribution,
      topRatedMovies: topRatedData.results.slice(0, 5), // Top 5 movies
      trendingMovies: trendingData.results.slice(0, 5), // Top 5 trending
    };
  } catch (error) {
    console.error("Error fetching movie metrics:", error);
    return null;
  }
};
