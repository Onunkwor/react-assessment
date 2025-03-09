import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import AddMovie from "../movies/AddMovie";

const EditMovie = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulating data fetch delay
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const handleEditSuccess = () => {
    toast.success("Movie updated successfully!");
    navigate("/movies");
  };

  if (!isLoaded) {
    return <div>Loading...</div>; // Simple loading state
  }

  return <AddMovie movieId={id} onComplete={handleEditSuccess} />;
};

export default EditMovie;
