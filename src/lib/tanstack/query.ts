import { useQuery } from "@tanstack/react-query";
import { fetchMovieMetrics } from "../api/api";

export const useGetMovieMetrics = () => {
  return useQuery({
    queryKey: ["getMovieMetrics"],
    queryFn: fetchMovieMetrics,
  });
};
