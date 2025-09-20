import React from 'react';

interface MovieCardProps {
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
  className?: string;
  onLike?: () => void;
  onDislike?: () => void;
  onMoreInfo?: () => void;
  showDesktopControls?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  title,
  synopsis,
  director,
  writer,
  starring = [],
  rating,
  year,
  duration,
  imdbScore,
  genres = [],
  posterUrl,
  className = '',
  onLike,
  onDislike,
  onMoreInfo,
  showDesktopControls = false,
}) => {
  // Genre chip color mapping
  const getGenreColor = (genre: string) => {
    const colors = [
      'bg-accent-green-chip text-button-label',
      'bg-accent-red-chip text-button-label',
      'bg-accent-cyan-20 text-button-label',
      'bg-brand-20 text-button-label',
    ];
    // Simple hash to consistently assign colors
    const hash = genre.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className={`
      w-full max-w-sm mx-auto
      bg-bg-secondary rounded-lg overflow-hidden
      ${className}
    `}>
      {/* Movie Poster */}
      <div className="relative w-full aspect-square bg-bg-tertiary rounded-t-sm flex items-center justify-center">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={`${title} poster`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-text-secondary text-h3 text-center px-4">
            {title}
          </div>
        )}
        
        {/* Desktop Controls Overlay */}
        {showDesktopControls && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center gap-4 opacity-0 hover:opacity-100">
            {onDislike && (
              <button
                onClick={onDislike}
                className="bg-accent-red-0 hover:bg-accent-red-10 text-white p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="Dislike movie"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {onMoreInfo && (
              <button
                onClick={onMoreInfo}
                className="bg-accent-primary hover:bg-accent-primary-hover text-button-label p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="More information"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
            {onLike && (
              <button
                onClick={onLike}
                className="bg-accent-green-0 hover:bg-accent-green-10 text-button-label p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                aria-label="Like movie"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Content Area */}
      <div className="p-4 flex flex-col gap-2">
        {/* Movie Title */}
        <h2 className="text-h2 text-text-primary font-semibold">
          {title}
        </h2>
        
        {/* Synopsis */}
        <p className="text-body text-text-secondary">
          {synopsis}
        </p>
        
        {/* Credits Section */}
        <div className="flex flex-col gap-1 text-chip">
          {director && (
            <div className="text-text-secondary">
              <span className="text-chip-bold text-text-primary">Director:</span> {director}
            </div>
          )}
          {writer && (
            <div className="text-text-secondary">
              <span className="text-chip-bold text-text-primary">Writer:</span> {writer}
            </div>
          )}
          {starring.length > 0 && (
            <div className="text-text-secondary">
              <span className="text-chip-bold text-text-primary">Starring:</span> {starring.join(', ')}
            </div>
          )}
        </div>
        
        {/* Metadata Line */}
        <div className="flex items-center gap-2 text-chip text-text-secondary">
          {rating && <span className="bg-bg-tertiary px-2 py-1 rounded-xs">{rating}</span>}
          {year && <span>{year}</span>}
          {duration && <span>{duration}</span>}
          {imdbScore && (
            <span className="flex items-center gap-1">
              <span className="text-accent-green-chip">★</span>
              {imdbScore}
            </span>
          )}
        </div>
        
        {/* Genre Chips */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {genres.map((genre, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-xs text-chip-bold ${getGenreColor(genre)}`}
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};