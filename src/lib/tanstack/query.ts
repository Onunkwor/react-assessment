import { useQuery } from "@tanstack/react-query";
import { fetchMovieMetrics, getAIExplanation, getMovies } from "../api/api";

export const useGetMovieMetrics = () => {
  return useQuery({
    queryKey: ["getMovieMetrics"],
    queryFn: fetchMovieMetrics,
  });
};

export const useGetMovies = () => {
  return useQuery({
    queryKey: ["getMovies"],
    queryFn: getMovies,
  });
};

export const useGetAIExplanation = (movieName: string) => {
  return useQuery({
    queryKey: ["getAIExplanation", movieName],
    queryFn: () => getAIExplanation(movieName),
  });
};
