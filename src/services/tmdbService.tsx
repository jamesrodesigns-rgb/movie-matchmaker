// TMDB API Service for Movie MatchMaker

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB API key not found. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment.');
  }
  return apiKey;
};

// TMDB API Response Types
interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
}

interface TMDBMovieDetails extends TMDBMovie {
  runtime: number | null;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string; order: number }[];
    crew: { id: number; name: string; job: string; department: string }[];
  };
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBDiscoverResponse {
  page: number;
  results: TMDBMovie[];
  total_results: number;
  total_pages: number;
}

// Our App's Movie Type (matches MovieCard interface)
export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  director?: string;
  writer?: string;
  starring?: string[];
  rating?: string;
  year?: number;
  duration?: string;
  imdbScore?: number;
  genres?: string[];
  posterUrl?: string;
  backdropUrl?: string;
}

// Movie Search/Filter Criteria
export interface MovieCriteria {
  genres?: string[];
  releaseYearMin?: number;
  releaseYearMax?: number;
  runtimeMin?: number;
  runtimeMax?: number;
  minRating?: number;
  includeAdult?: boolean;
  sortBy?: 'popularity' | 'rating' | 'release_date' | 'revenue';
  page?: number;
}

class TMDBService {
  private apiKey: string;
  private genreMap: Map<number, string> = new Map();

  constructor() {
    this.apiKey = getApiKey();
  }

  // Initialize genre mapping
  async initializeGenres(): Promise<void> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/genre/movie/list?api_key=${this.apiKey}&language=en-US`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data: { genres: TMDBGenre[] } = await response.json();
      
      // Build genre ID to name mapping
      data.genres.forEach(genre => {
        this.genreMap.set(genre.id, genre.name);
      });
    } catch (error) {
      console.error('Failed to load movie genres:', error);
      // Set some default genres if API fails
      this.setDefaultGenres();
    }
  }

  // Set default genres in case of API failure
  private setDefaultGenres(): void {
    const defaultGenres: [number, string][] = [
      [28, 'Action'], [12, 'Adventure'], [16, 'Animation'], [35, 'Comedy'],
      [80, 'Crime'], [99, 'Documentary'], [18, 'Drama'], [10751, 'Family'],
      [14, 'Fantasy'], [36, 'History'], [27, 'Horror'], [10402, 'Music'],
      [9648, 'Mystery'], [10749, 'Romance'], [878, 'Science Fiction'],
      [10770, 'TV Movie'], [53, 'Thriller'], [10752, 'War'], [37, 'Western']
    ];
    
    defaultGenres.forEach(([id, name]) => {
      this.genreMap.set(id, name);
    });
  }

  // Convert TMDB movie to our Movie format
  private convertTMDBMovie(tmdbMovie: TMDBMovie, details?: TMDBMovieDetails): Movie {
    const year = tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : undefined;
    
    // Get genre names from IDs
    const genres = tmdbMovie.genre_ids?.map(id => this.genreMap.get(id)).filter(Boolean) || [];
    
    // Extract director and main cast from details if available
    let director: string | undefined;
    let writer: string | undefined;
    let starring: string[] = [];

    if (details?.credits) {
      // Find director
      const directorCredit = details.credits.crew.find(person => person.job === 'Director');
      director = directorCredit?.name;

      // Find writer (screenplay or story)
      const writerCredit = details.credits.crew.find(person => 
        person.job === 'Screenplay' || person.job === 'Writer' || person.job === 'Story'
      );
      writer = writerCredit?.name;

      // Get top 3 cast members
      starring = details.credits.cast
        .sort((a, b) => a.order - b.order)
        .slice(0, 3)
        .map(actor => actor.name);
    }

    // Format duration
    const duration = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : undefined;

    return {
      id: tmdbMovie.id.toString(),
      title: tmdbMovie.title,
      synopsis: tmdbMovie.overview || 'No synopsis available.',
      director,
      writer,
      starring: starring.length > 0 ? starring : undefined,
      rating: this.getMPAARating(tmdbMovie), // We'll implement this
      year,
      duration,
      imdbScore: Math.round(tmdbMovie.vote_average * 10) / 10,
      genres: genres as string[],
      posterUrl: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${tmdbMovie.poster_path}` : undefined,
      backdropUrl: tmdbMovie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}/w1280${tmdbMovie.backdrop_path}` : undefined,
    };
  }

  // Get MPAA rating (simplified - TMDB doesn't always have this)
  private getMPAARating(movie: TMDBMovie): string | undefined {
    if (movie.adult) return 'R';
    // For now, return undefined - we'd need additional API calls for proper ratings
    return undefined;
  }

  // Discover movies based on criteria
  async discoverMovies(criteria: MovieCriteria = {}): Promise<Movie[]> {
    // Ensure genres are loaded
    if (this.genreMap.size === 0) {
      await this.initializeGenres();
    }

    const params = new URLSearchParams({
      api_key: this.apiKey,
      language: 'en-US',
      page: (criteria.page || 1).toString(),
      include_adult: (criteria.includeAdult || false).toString(),
      'vote_count.gte': '100', // Ensure movies have enough votes
    });

    // Add genre filter
    if (criteria.genres && criteria.genres.length > 0) {
      const genreIds = criteria.genres.map(genreName => {
        // Find genre ID by name
        for (const [id, name] of this.genreMap.entries()) {
          if (name.toLowerCase() === genreName.toLowerCase()) {
            return id;
          }
        }
        return null;
      }).filter(Boolean);
      
      if (genreIds.length > 0) {
        params.append('with_genres', genreIds.join(','));
      }
    }

    // Add date filters
    if (criteria.releaseYearMin) {
      params.append('primary_release_date.gte', `${criteria.releaseYearMin}-01-01`);
    }
    if (criteria.releaseYearMax) {
      params.append('primary_release_date.lte', `${criteria.releaseYearMax}-12-31`);
    }

    // Add runtime filters
    if (criteria.runtimeMin) {
      params.append('with_runtime.gte', criteria.runtimeMin.toString());
    }
    if (criteria.runtimeMax) {
      params.append('with_runtime.lte', criteria.runtimeMax.toString());
    }

    // Add rating filter
    if (criteria.minRating) {
      params.append('vote_average.gte', criteria.minRating.toString());
    }

    // Add sorting
    const sortMapping = {
      popularity: 'popularity.desc',
      rating: 'vote_average.desc',
      release_date: 'release_date.desc',
      revenue: 'revenue.desc',
    };
    params.append('sort_by', sortMapping[criteria.sortBy || 'popularity']);

    try {
      const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`);
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data: TMDBDiscoverResponse = await response.json();
      
      return data.results.map(movie => this.convertTMDBMovie(movie));
    } catch (error) {
      console.error('Failed to discover movies:', error);
      throw error;
    }
  }

  // Get detailed movie information
  async getMovieDetails(movieId: string): Promise<Movie> {
    try {
      const [movieResponse, creditsResponse] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${this.apiKey}&language=en-US`),
        fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${this.apiKey}`)
      ]);

      if (!movieResponse.ok || !creditsResponse.ok) {
        throw new Error('Failed to fetch movie details');
      }

      const movieData: TMDBMovieDetails = await movieResponse.json();
      const creditsData = await creditsResponse.json();

      movieData.credits = creditsData;

      return this.convertTMDBMovie(movieData, movieData);
    } catch (error) {
      console.error('Failed to get movie details:', error);
      throw error;
    }
  }

  // Get available genres for filter UI
  getGenres(): string[] {
    return Array.from(this.genreMap.values()).sort();
  }

  // Search movies by title
  async searchMovies(query: string, page: number = 1): Promise<Movie[]> {
    if (this.genreMap.size === 0) {
      await this.initializeGenres();
    }

    const params = new URLSearchParams({
      api_key: this.apiKey,
      language: 'en-US',
      query: query,
      page: page.toString(),
      include_adult: 'false',
    });

    try {
      const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data: TMDBDiscoverResponse = await response.json();
      
      return data.results.map(movie => this.convertTMDBMovie(movie));
    } catch (error) {
      console.error('Failed to search movies:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const tmdbService = new TMDBService();