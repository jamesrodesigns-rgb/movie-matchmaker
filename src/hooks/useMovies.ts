import { useState, useEffect, useCallback } from 'react';
import { tmdbService, Movie, MovieCriteria } from '../services/tmdbService';

interface UseMoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
}

interface UseMoviesActions {
  discoverMovies: (criteria?: MovieCriteria) => Promise<void>;
  searchMovies: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
  getMovieDetails: (movieId: string) => Promise<Movie | null>;
  reset: () => void;
}

export const useMovies = (): UseMoviesState & UseMoviesActions => {
  const [state, setState] = useState<UseMoviesState>({
    movies: [],
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1,
  });

  const [lastCriteria, setLastCriteria] = useState<MovieCriteria | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  // Discover movies based on criteria
  const discoverMovies = useCallback(async (criteria: MovieCriteria = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const movies = await tmdbService.discoverMovies({ ...criteria, page: 1 });
      setLastCriteria(criteria);
      setLastQuery(null);
      
      setState({
        movies,
        loading: false,
        error: null,
        hasMore: movies.length === 20, // TMDB returns 20 per page
        currentPage: 1,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load movies',
      }));
    }
  }, []);

  // Search movies by title
  const searchMovies = useCallback(async (query: string) => {
    if (!query.trim()) {
      reset();
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const movies = await tmdbService.searchMovies(query, 1);
      setLastQuery(query);
      setLastCriteria(null);
      
      setState({
        movies,
        loading: false,
        error: null,
        hasMore: movies.length === 20,
        currentPage: 1,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to search movies',
      }));
    }
  }, []);

  // Load more movies (pagination)
  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;

    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const nextPage = state.currentPage + 1;
      let newMovies: Movie[];

      if (lastQuery) {
        newMovies = await tmdbService.searchMovies(lastQuery, nextPage);
      } else if (lastCriteria) {
        newMovies = await tmdbService.discoverMovies({ ...lastCriteria, page: nextPage });
      } else {
        newMovies = await tmdbService.discoverMovies({ page: nextPage });
      }

      setState(prev => ({
        ...prev,
        movies: [...prev.movies, ...newMovies],
        loading: false,
        hasMore: newMovies.length === 20,
        currentPage: nextPage,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load more movies',
      }));
    }
  }, [state.loading, state.hasMore, state.currentPage, lastQuery, lastCriteria]);

  // Get detailed movie information
  const getMovieDetails = useCallback(async (movieId: string): Promise<Movie | null> => {
    try {
      return await tmdbService.getMovieDetails(movieId);
    } catch (error) {
      console.error('Failed to get movie details:', error);
      return null;
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState({
      movies: [],
      loading: false,
      error: null,
      hasMore: true,
      currentPage: 1,
    });
    setLastCriteria(null);
    setLastQuery(null);
  }, []);

  return {
    ...state,
    discoverMovies,
    searchMovies,
    loadMore,
    getMovieDetails,
    reset,
  };
};

// Hook specifically for getting available genres
export const useGenres = () => {
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        // Initialize the service to load genres
        await tmdbService.initializeGenres();
        setGenres(tmdbService.getGenres());
      } catch (error) {
        console.error('Failed to load genres:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  return { genres, loading };
};

// Hook for a single movie (useful for movie details page)
export const useMovie = (movieId: string | null) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) {
      setMovie(null);
      return;
    }

    const loadMovie = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const movieData = await tmdbService.getMovieDetails(movieId);
        setMovie(movieData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie');
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [movieId]);

  return { movie, loading, error };
};