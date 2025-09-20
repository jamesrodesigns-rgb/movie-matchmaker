import React from 'react';
import { MovieCard } from './MovieCards';
import { Button } from './Button';
import { useShowDesktopControls } from '../src/hooks/useDeviceDetection';

interface Movie {
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
}

interface MovieGridProps {
  movies: Movie[];
  onLike?: (movieId: string) => void;
  onDislike?: (movieId: string) => void;
  onMoreInfo?: (movieId: string) => void;
  layout?: 'single' | 'grid';
  className?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  onLike,
  onDislike,
  onMoreInfo,
  layout = 'single',
  className = '',
}) => {
  const showDesktopControls = useShowDesktopControls();

  const gridStyles = {
    single: `
      flex flex-col items-center gap-4
      // Single card centered for mobile swipe interface
      sm:max-w-sm mx-auto
    `,
    grid: `
      grid grid-cols-1 gap-4
      sm:grid-cols-2 sm:gap-6
      lg:grid-cols-3 lg:gap-8
      xl:grid-cols-4
      // Responsive grid for desktop browsing
    `,
  };

  return (
    <div className={`
      w-full px-4
      ${gridStyles[layout]}
      ${className}
    `}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          synopsis={movie.synopsis}
          director={movie.director}
          writer={movie.writer}
          starring={movie.starring}
          rating={movie.rating}
          year={movie.year}
          duration={movie.duration}
          imdbScore={movie.imdbScore}
          genres={movie.genres}
          posterUrl={movie.posterUrl}
          onLike={() => onLike?.(movie.id)}
          onDislike={() => onDislike?.(movie.id)}
          onMoreInfo={() => onMoreInfo?.(movie.id)}
          showDesktopControls={showDesktopControls}
          className={layout === 'single' ? 'w-full max-w-sm' : ''}
        />
      ))}
    </div>
  );
};

// Swipe-specific container for the main matching interface
export const SwipeContainer: React.FC<{
  movie: Movie;
  onLike: () => void;
  onDislike: () => void;
  onMoreInfo?: () => void;
  className?: string;
}> = ({ movie, onLike, onDislike, onMoreInfo, className = '' }) => {
  const showDesktopControls = useShowDesktopControls();

  return (
    <div className={`
      flex justify-center items-center min-h-screen p-4
      ${className}
    `}>
      <div className="w-full max-w-sm">
        <MovieCard
          title={movie.title}
          synopsis={movie.synopsis}
          director={movie.director}
          writer={movie.writer}
          starring={movie.starring}
          rating={movie.rating}
          year={movie.year}
          duration={movie.duration}
          imdbScore={movie.imdbScore}
          genres={movie.genres}
          posterUrl={movie.posterUrl}
          onLike={onLike}
          onDislike={onDislike}
          onMoreInfo={onMoreInfo}
          showDesktopControls={showDesktopControls}
        />
        
        {/* Mobile-only swipe hint */}
        {!showDesktopControls && (
          <div className="text-center mt-4 text-text-secondary text-chip">
            Swipe right to like, left to pass
          </div>
        )}
        
        {/* Desktop-only action buttons */}
        {showDesktopControls && (
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="tertiary" size="lg" onClick={onDislike}>
              Pass
            </Button>
            {onMoreInfo && (
              <Button variant="secondary" size="lg" onClick={onMoreInfo}>
                More Info
              </Button>
            )}
            <Button variant="primary" size="lg" onClick={onLike}>
              Like
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};