import { useEffect, useState } from "react";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    // Loader state
    const [isLoading, setIsLoading] = useState(false);
    // Error state
    const [error, setError] = useState("");

    // Fetch data from the api
    useEffect(
        function () {
            // The function will only be called if it exists
            // callback?.();

            const controller = new AbortController();

            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");
                    const res = await fetch(
                        `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&s=${query}`,
                        { signal: controller.signal }
                    );

                    // Handling not getting data
                    if (!res.ok)
                        throw new Error(
                            "Something went wrong with fetching movies"
                        );

                    const data = await res.json();
                    // Movie not found
                    if (data.Response === "False")
                        throw new Error("Movie not found");

                    setMovies(data.Search);
                    setError("");
                } catch (err) {
                    if (err.name !== "AbortError") {
                        setError(err.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }

            // not calling the fetch function
            if (query.length < 3) {
                setMovies([]);
                setError("");
                return;
            }

            fetchMovies();

            // clean up function to solve race condition
            return function () {
                controller.abort();
            };
        },
        [query]
    );

    return { movies, isLoading, error };
}
