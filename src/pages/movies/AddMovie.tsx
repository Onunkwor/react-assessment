import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
// Movie schema
const formSchema = z.object({
  title: z.string().min(2, "Title is too short").max(100),
  image: z.string().url("Invalid image URL"),
  rating: z.number().min(0).max(10).step(0.1),
  genre: z.string().min(2, "Genre is required"),
  releaseDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  overview: z.string().min(10, "Overview is too short"),
  isOwn: z.boolean(),
});

// Common genres for dropdown
const commonGenres = [
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

// Type for form values
type MovieFormValues = z.infer<typeof formSchema>;

const AddMovie = ({
  movieId,
  onComplete,
}: {
  movieId?: string;
  onComplete?: () => void;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const isEditing = !!movieId;
  const navigate = useNavigate();
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      image: "",
      rating: 5,
      genre: "",
      releaseDate: new Date().toISOString().split("T")[0],
      overview: "",
      isOwn: true,
    },
  });

  // Load existing movie data if editing
  useEffect(() => {
    if (movieId) {
      const movies = JSON.parse(localStorage.getItem("movies") || "[]");
      const existingMovie = movies.find((m: any) => m.id === movieId);
      if (existingMovie) {
        form.reset(existingMovie);
        setImagePreview(existingMovie.image);
      }
    }
  }, [movieId, form]);

  // Watch for image URL changes to update preview
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "image" && value.image) {
        setImagePreview(value.image as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Submit handler
  function onSubmit(values: MovieFormValues) {
    const movies = JSON.parse(localStorage.getItem("movies") || "[]");

    if (isEditing) {
      // Editing existing movie
      const updatedMovies = movies.map((movie: any) =>
        movie.id === movieId ? { ...movie, ...values } : movie
      );
      localStorage.setItem("movies", JSON.stringify(updatedMovies));
    } else {
      // Adding new movie
      const newMovie = { id: Date.now(), ...values };
      localStorage.setItem("movies", JSON.stringify([...movies, newMovie]));
    }

    toast.success("Movie Saved Completely");
    navigate("/movies");
    if (onComplete) onComplete();
  }

  return (
    <div className="h-full overflow-y-auto py-5">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className=" text-black">
          <CardTitle className="text-2xl font-bold">
            {isEditing ? "Edit Movie" : "Add New Movie"}
          </CardTitle>
          <CardDescription className="text-black">
            {isEditing
              ? "Update the details of your movie"
              : "Fill in the details to add a movie to your collection"}
          </CardDescription>
        </CardHeader>

        <div className="px-6 pt-6"></div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Movie Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter movie title"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                              <SelectValue placeholder="Select a genre" />
                            </SelectTrigger>
                            <SelectContent>
                              {commonGenres.map((genre) => (
                                <SelectItem key={genre} value={genre}>
                                  {genre}
                                </SelectItem>
                              ))}
                              <SelectItem value="other">
                                Other (Custom)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {field.value === "other" && (
                          <Input
                            placeholder="Enter custom genre"
                            onChange={(e) => field.onChange(e.target.value)}
                            className="mt-2 focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poster Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/poster.jpg"
                            {...field}
                            className="focus:ring-2 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                        {imagePreview && (
                          <div className="mt-2 rounded-md overflow-hidden border border-gray-200 shadow-sm">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover"
                              onError={() => setImagePreview(null)}
                            />
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>
                          Rating ({parseFloat(value.toString()).toFixed(1)}
                          /10)
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Slider
                              min={0}
                              max={10}
                              step={0.1}
                              value={[parseFloat(value.toString())]}
                              onValueChange={(vals: any) => onChange(vals[0])}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={value}
                              onChange={(e) =>
                                onChange(parseFloat(e.target.value) || 0)
                              }
                              className="w-16 focus:ring-2 focus:ring-blue-500"
                              {...fieldProps}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="overview"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mt-6">Movie Overview</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief description of the movie..."
                        className="min-h-32 focus:ring-2 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include a summary of the plot without spoilers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex gap-2 justify-between px-6 py-4 bg-gray-50 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (activeTab === "details") {
                    setActiveTab("basic");
                  } else if (onComplete) {
                    onComplete();
                  }
                }}
              >
                {activeTab === "details" ? "Back" : "Cancel"}
              </Button>

              <div className="flex gap-2">
                {activeTab === "basic" && (
                  <Button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    variant="secondary"
                  >
                    Next
                  </Button>
                )}

                <Button
                  type="submit"
                  className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ${
                    activeTab === "basic" ? "hidden md:inline-flex" : ""
                  }`}
                >
                  {isEditing ? "Update Movie" : "Save Movie"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddMovie;
