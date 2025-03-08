import { useGetMovieMetrics } from "@/lib/tanstack/query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PieChartComponent } from "@/components/ui/piechart";
import { LineChartComponent } from "@/components/ui/linechart";
import { BarChartComponent } from "@/components/ui/barchart";

// Skeleton loading component
const SkeletonCard = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </CardHeader>
    <CardContent>
      <div className="h-64 bg-gray-200 rounded"></div>
    </CardContent>
  </Card>
);

// Error component
const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive" className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      {message || "Failed to load dashboard data. Please try again later."}
    </AlertDescription>
  </Alert>
);

interface Movie {
  id: number;
  title: string;
  original_title: string;
  vote_average: number;
  popularity: number;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
}

const Dashboard = () => {
  const { data, isPending, error } = useGetMovieMetrics();

  // Handle loading state
  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto h-full">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Handle error state
  if (error || !data) {
    return (
      <div className="p-6">
        <ErrorDisplay message={error?.message || ""} />
      </div>
    );
  }

  // Convert genre data for charts
  const genreData = Object.keys(data.genreDistribution).map((genre) => ({
    name: genre,
    value: data.genreDistribution[genre],
  }));

  // Prepare top-rated movies data
  const topRatedData = data.topRatedMovies.map((movie: Movie) => ({
    name: movie.title,
    rating: movie.vote_average,
  }));

  // Prepare trending movies data
  const trendingData = data.trendingMovies.map((movie: Movie) => ({
    name: movie.original_title,
    value: movie.popularity,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto h-full bg-gray-50">
      {/* Average Rating Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardTitle className="flex items-center">
            <span className="text-xl">Average Movie Rating</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-blue-600">
            {data.averageRating.toFixed(1)}
          </div>
          <div className="text-xl text-gray-500 mt-2">out of 10</div>
          <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${(data.averageRating / 10) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Genre Distribution Bar Chart */}

      <BarChartComponent genreData={genreData} />

      {/* Top Rated Movies Line Chart */}

      <LineChartComponent topRatedData={topRatedData} />

      {/* Trending Movies Pie Chart */}

      <PieChartComponent trendingData={trendingData} />
    </div>
  );
};

export default Dashboard;
