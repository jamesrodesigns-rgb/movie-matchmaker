'use client';

import React, { useEffect, useState } from 'react';
import { useMovies, useGenres } from '../hooks/useMovies';
import { MovieGrid, SwipeContainer } from '../../components/MovieGrid';
import { Button } from '../../components/Button';
import { MovieCriteria } from '../services/tmdbService';

export const MovieDemo: React.FC = () => {
  const { movies, loading, error, discoverMovies, searchMovies, reset } = useMovies();
  const { genres, loading: genresLoading } = useGenres();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('grid');

  // Load initial popular movies
  useEffect(() => {
    discoverMovies({ sortBy: 'popularity' });
  }, [discoverMovies]);

  // Handle movie actions
  const handleLike = (movieId: string) => {
    console.log('Liked movie:', movieId);
    if (viewMode === 'swipe') {
      setCurrentMovieIndex(prev => prev + 1);
    }
  };

  const handleDislike = (movieId: string) => {
    console.log('Disliked movie:', movieId);
    if (viewMode === 'swipe') {
      setCurrentMovieIndex(prev => prev + 1);
    }
  };

  const handleMoreInfo = (movieId: string) => {
    console.log('More info for movie:', movieId);
    // In real app, this would open a modal or navigate to details page
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMovies(searchQuery);
      setCurrentMovieIndex(0);
    } else {
      discoverMovies({ sortBy: 'popularity' });
    }
  };

  // Handle genre filter
  const handleGenreToggle = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    
    setSelectedGenres(newGenres);
    
    const criteria: MovieCriteria = {
      genres: newGenres.length > 0 ? newGenres : undefined,
      sortBy: 'popularity',
    };
    
    discoverMovies(criteria);
    setCurrentMovieIndex(0);
  };

  const currentMovie = movies[currentMovieIndex];

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-h2 text-text-primary mb-4">Error Loading Movies</h1>
          <p className="text-body text-text-secondary mb-6">{error}</p>
          <Button onClick={() => reset()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-h2 text-text-primary font-semibold mb-4">
            Movie MatchMaker Demo
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="flex-1 px-4 py-2 bg-bg-tertiary text-text-primary rounded-sm border border-surface-40 focus:border-accent-primary focus:outline-none"
            />
            <Button type="submit" size="md">
              Search
            </Button>
            <Button variant="secondary" onClick={() => {
              setSearchQuery('');
              discoverMovies({ sortBy: 'popularity' });
            }}>
              Clear
            </Button>
          </form>

          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === 'swipe' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('swipe')}
              size="sm"
            >
              Swipe Mode
            </Button>
          </div>

          {/* Genre Filters */}
          {!genresLoading && (
            <div className="mb-4">
              <h3 className="text-label text-text-primary mb-2">Filter by Genre:</h3>
              <div className="flex flex-wrap gap-2">
                {genres.slice(0, 10).map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1 rounded-xs text-chip-bold transition-colors ${
                      selectedGenres.includes(genre)
                        ? 'bg-accent-primary text-button-label'
                        : 'bg-bg-tertiary text-text-secondary hover:bg-surface-30'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-h3 text-text-secondary">Loading movies...</div>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-h3 text-text-primary mb-2">No movies found</div>
              <div className="text-body text-text-secondary">Try adjusting your search or filters</div>
            </div>
          </div>
        ) : viewMode === 'swipe' ? (
          /* Swipe Mode */
          currentMovie ? (
            <SwipeContainer
              movie={currentMovie}
              onLike={() => handleLike(currentMovie.id)}
              onDislike={() => handleDislike(currentMovie.id)}
              onMoreInfo={() => handleMoreInfo(currentMovie.id)}
            />
          ) : (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="text-h3 text-text-primary mb-2">No more movies!</div>
                <Button onClick={() => setCurrentMovieIndex(0)}>
                  Start Over
                </Button>
              </div>
            </div>
          )
        ) : (
          /* Grid Mode */
          <MovieGrid
            movies={movies}
            layout="grid"
            onLike={handleLike}
            onDislike={handleDislike}
            onMoreInfo={handleMoreInfo}
          />
        )}
      </main>

      {/* Debug Info */}
      <footer className="bg-bg-secondary p-4 mt-8">
        <div className="max-w-6xl mx-auto text-chip text-text-secondary">
          <div>Movies loaded: {movies.length}</div>
          {viewMode === 'swipe' && (
            <div>Current movie: {currentMovieIndex + 1} of {movies.length}</div>
          )}
          <div>Selected genres: {selectedGenres.join(', ') || 'None'}</div>
        </div>
      </footer>
    </div>
  );
};