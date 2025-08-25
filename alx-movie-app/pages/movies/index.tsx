import Button from "@/components/commons/Button";
import Loading from "@/components/commons/Loading";
import MovieCard from "@/components/commons/MovieCard";
import { MoviesProps } from "@/interfaces";
import { useCallback, useEffect, useState } from "react";

interface MoviesApiResponse {
  movies: MoviesProps[];
}

const Movies: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [year, setYear] = useState<number | null>(null);
  const [genre, setGenre] = useState<string>("All");
  const [movies, setMovies] = useState<MoviesProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/fetch-movies", {
        method: "POST",
        body: JSON.stringify({
          page,
          year,
          genre: genre === "All" ? "" : genre,
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error: ${response.status} ${text}`);
      }

      const data: MoviesApiResponse = await response.json();
      setMovies(data.movies || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Fetch error:", err.message);
      } else {
        console.error("Unexpected error:", err);
      }
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, year, genre]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="min-h-screen bg-[#110F17] text-white px-4 md:px-10 lg:px-44">
      <div className="py-16">
        {/* Search + Year filter */}
        <div className="flex flex-col md:flex-row justify-between mb-4 items-center space-x-0 md:space-x-4">
          <input
            type="text"
            placeholder="Search for a movie..."
            className="border-2 w-full md:w-96 border-[#E2D609] outline-none bg-transparent px-4 py-2 rounded-full text-white placeholder-gray-400"
          />

          <select
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setYear(event.target.value ? Number(event.target.value) : null)
            }
            className="border-2 border-[#E2D609] outline-none bg-transparent px-4 md:px-8 py-2 mt-4 md:mt-0 rounded-full w-full md:w-auto"
          >
            <option value="">Select Year</option>
            {[2024, 2023, 2022, 2021, 2020, 2019].map((y) => (
              <option value={y} key={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <p className="text-[#E2D609] text-xl mb-6 mt-6">Online streaming</p>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-lg md:text-6xl font-bold">
            {year || "Latest"} {genre} Movies
          </h1>
          <div className="flex flex-wrap space-x-0 md:space-x-4 mt-4 md:mt-0">
            {["All", "Animation", "Comedy", "Fantasy"].map((g, key) => (
              <Button title={g} key={key} action={() => setGenre(g)} />
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {error ? (
         <p className="text-red-500 mt-10">{error}</p>
         ) : (
       <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mt-10">
         {Array.isArray(movies) &&
         movies.map((movie, key) => (
         <MovieCard
          key={key}
          title={movie.title}
          posterImage={movie.image}
          releaseYear={movie.year}
         />
         ))}
         </div>
         )}

        {/* Pagination */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            title="Previous"
            action={() => setPage((prev) => (prev > 1 ? prev - 1 : 1))}
          />
          <Button title="Next" action={() => setPage(page + 1)} />
        </div>
      </div>

      {loading && <Loading />}
    </div>
  );
};

export default Movies;
