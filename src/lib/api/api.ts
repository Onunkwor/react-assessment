import OpenAI from "openai";
import {
  VITE_MOVIE_DB_KEY,
  VITE_OPENROUTER_API_KEY,
  VITE_OPENROUTER_BASE_URL,
} from "@/config/config";

const openai = new OpenAI({
  baseURL: VITE_OPENROUTER_BASE_URL,
  apiKey: VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
});

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
export const getMovies = async () => {
  try {
    const endpoints = {
      popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
      trending: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
      topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
      upcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`,
      nowPlaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`,
      genres: `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    };

    // Fetch all categories concurrently
    const [popular, trending, topRated, upcoming, nowPlaying, genresData] =
      await Promise.all(
        Object.values(endpoints).map((url) =>
          fetch(url).then((res) => res.json())
        )
      );

    // Create a genre mapping { id: "Genre Name" }
    const genreMap: Record<number, string> = {};
    genresData.genres.forEach((genre: any) => {
      genreMap[genre.id] = genre.name;
    });

    // Function to map genre IDs to genre names
    const mapGenres = (movies: any[]) =>
      movies.map((movie) => ({
        ...movie,
        genres: movie.genre_ids.map((id: number) => genreMap[id] || "Unknown"),
      }));

    return {
      popular: mapGenres(popular.results || []),
      trending: mapGenres(trending.results || []),
      topRated: mapGenres(topRated.results || []),
      upcoming: mapGenres(upcoming.results || []),
      nowPlaying: mapGenres(nowPlaying.results || []),
    };
  } catch (error) {
    console.error("Error fetching movie list", error);
    return null;
  }
};

export const getAIExplanation = async (movieName: string) => {
  try {
    const prompt = `You are a master storyteller. Instead of simply recommending the movie "${movieName}", transport the reader into its world. 
    Make them feel the emotions, the tension, the thrill, or the heartbreak of the story. Describe a pivotal moment as if they were living it—what they see, hear, and feel. 
    Engage their senses and make them crave the experience of watching it unfold on screen. Keep it immersive, vivid, and compelling within a brief paragraph.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9, // Slightly increased to make the response more creative
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error getting AI explanation", error);
    return null;
  }
};
