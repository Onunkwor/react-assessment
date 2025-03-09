import React, { JSX, useEffect, useState } from "react";
import { Card, Carousel } from "@/components/ui/movie-cards-carousel";
import { useGetMovies } from "@/lib/tanstack/query";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface MovieCard {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[]; // Array of genre IDs
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string; // Keeping as string since API returns YYYY-MM-DD
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  genres: string[];
}

// Skeleton Loader for Movie Carousel
const SkeletonCarousel = () => {
  const skeletonCards = Array(5)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="flex flex-col gap-2 animate-pulse">
        <div className="w-64 h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    ));

  return (
    <div className="flex overflow-hidden gap-6 px-4 py-6">{skeletonCards}</div>
  );
};

// Error Display Component
const ErrorDisplay: React.FC<{ message?: string }> = ({ message }) => (
  <Alert variant="destructive" className="mb-6 mx-4 max-w-7xl">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      {message || "Failed to load movies. Please try again later."}
    </AlertDescription>
  </Alert>
);
// Common movie genres
const commonGenres = [
  "All", // Added for 'Show All' functionality
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
];
// Movie Section Component
const MovieSection: React.FC<{
  title: string;
  movies: React.ReactNode[] | undefined;
}> = ({ title, movies }) => (
  <section className="mb-12">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 font-sans relative">
        <span className="relative inline-block">
          {title}
          <div className="absolute -bottom-2 left-0 h-1 w-20 bg-red-600 rounded"></div>
        </span>
      </h2>
    </div>
    <Carousel items={(movies || []) as JSX.Element[]} />
  </section>
);

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<MovieCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { data, isPending, error } = useGetMovies();
  useEffect(() => {
    const storedMovies = JSON.parse(localStorage.getItem("movies") || "[]").map(
      (data: any) => ({
        adult: data.adult ?? false,
        backdrop_path: data.image ?? "",
        genre_ids: data.genre_ids ?? [],
        genres:
          typeof data.genre === "string" ? [data.genre] : data.genre ?? [],
        id: data.id ?? 0,
        original_language: data.original_language ?? "unknown",
        original_title: data.original_title ?? data.title ?? "Untitled",
        overview: data.overview ?? "No overview available.",
        popularity: data.popularity ?? 0,
        poster_path: data.image ?? "",
        release_date: data.releaseDate ?? "0000-00-00",
        title: data.title ?? "Untitled",
        video: data.video ?? false,
        vote_average: data.rating ?? 0,
        vote_count: data.vote_count ?? 0,
        isOwn: data.isOwn,
      })
    );
    setMovies(storedMovies);
  }, []);
  console.log(movies);

  // Loading State with Skeleton UI
  if (isPending) {
    return (
      <div className="w-full h-full py-5 overflow-y-auto space-y-12 bg-gray-50 dark:bg-gray-900">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="mb-12">
              <div className="max-w-7xl mx-auto px-4">
                <div className="w-48 h-8 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
              </div>
              <SkeletonCarousel />
            </div>
          ))}
      </div>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <div className="w-full h-full py-12 flex flex-col items-center justify-center">
        <ErrorDisplay message={(error as Error)?.message} />
        <button
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  const handleDelete = (movieId: number) => {
    const updatedMovies = movies.filter((m) => m.id !== movieId);
    const mappedMovies = updatedMovies.map((m) => {
      return {
        title: m.title,
        image: m.poster_path,
        rating: m.vote_count,
        genre: m.genres,
        releaseDate: m.release_date,
        overview: m.overview,
        isOwn: true,
      };
    });
    localStorage.setItem("movies", JSON.stringify(mappedMovies));
    setMovies(updatedMovies);
    toast.success("Movie deleted successfully");
  };

  // **Filter logic**
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || movie.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });
  // Map movie data to components
  const popularMovieCards = data?.popular.map(
    (card: MovieCard, index: number) => (
      <Card key={card.id} card={card} index={index} />
    )
  );

  const trendingMovieCards = data?.trending.map(
    (card: MovieCard, index: number) => (
      <Card key={card.id} card={card} index={index} />
    )
  );

  const topRatedMovieCards = data?.topRated.map(
    (card: MovieCard, index: number) => (
      <Card key={card.id} card={card} index={index} />
    )
  );

  const upcomingMovieCards = data?.upcoming.map(
    (card: MovieCard, index: number) => (
      <Card key={card.id} card={card} index={index} />
    )
  );

  const nowPlayingMovieCards = data?.nowPlaying.map(
    (card: MovieCard, index: number) => (
      <Card key={card.id} card={card} index={index} />
    )
  );
  const myMoviesCard = filteredMovies.map((card: MovieCard, index: number) => (
    <Card
      key={card.id}
      card={card}
      index={index}
      onDelete={() => handleDelete(card.id)}
    />
  ));

  return (
    <div className="w-full h-full py-8 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="max-w-7xl mx-auto px-4 mb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
          Movie Collections
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Discover the best films across different categories
        </p>
      </header>

      {/* My Movies Section */}
      {myMoviesCard.length > 0 && (
        <>
          {/* Search & Filter Section */}
          <div className="max-w-7xl mx-auto px-4 mb-6 flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <Input
              placeholder="Search My Movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-1/2"
            />

            {/* Genre Filter */}
            <Select
              onValueChange={(value) => setSelectedGenre(value)}
              defaultValue="All"
            >
              <SelectTrigger className="w-full md:w-1/3">
                <SelectValue placeholder="Filter by Genre" />
              </SelectTrigger>
              <SelectContent>
                {commonGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <MovieSection title="My Movies" movies={myMoviesCard} />
        </>
      )}

      {/* Other Movie Sections */}
      <MovieSection title="Popular Movies" movies={popularMovieCards} />
      <MovieSection title="Top Rated Movies" movies={topRatedMovieCards} />
      <MovieSection title="Trending Movies" movies={trendingMovieCards} />
      <MovieSection title="Upcoming Movies" movies={upcomingMovieCards} />
      <MovieSection title="Now Playing" movies={nowPlayingMovieCards} />

      <footer className="max-w-7xl mx-auto px-4 py-8 mt-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-center text-neutral-600 dark:text-neutral-400">
          Data provided by Movie Database API • Updated daily
        </p>
      </footer>
    </div>
  );
};

export default Movies;
