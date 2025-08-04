// Example usage:
// <BreweryCard 
//   logoSrc="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=96&h=96&fit=crop"
//   name="Three Notch'd Brewing"
//   rating={4.2}
//   onDetails={() => navigate('/brewery/three-notchd')}
// />

import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronRight, Star } from 'lucide-react';

interface BreweryCardProps {
  logoSrc: string;           // URL or import of the brewery's logo
  name: string;              // Brewery name
  rating: number;            // Untappd average rating (0–5)
  onDetails: () => void;     // handler for "Details" tap
}

export const BreweryCard: React.FC<BreweryCardProps> = ({
  logoSrc,
  name,
  rating,
  onDetails
}) => {
  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <Star className="absolute top-0 left-0 w-4 h-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }
    
    return stars;
  };

  return (
    <div
      className="w-full p-4 bg-card rounded-lg shadow-sm border border-border cursor-pointer hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      onClick={onDetails}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDetails();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
    >
      <div className="flex items-center space-x-4">
        {/* Brewery Logo */}
        <div className="flex-shrink-0">
          <ImageWithFallback
            src={logoSrc}
            alt={`${name} logo`}
            className="w-12 h-12 rounded-full object-cover border-2 border-border"
          />
        </div>
        
        {/* Brewery Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        {/* Details Arrow */}
        <div className="flex-shrink-0">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};