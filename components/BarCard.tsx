// Example usage:
// <BarCard 
//   imageSrc="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
//   name="Miller's Downtown"
//   tags={["Patio", "Pool Tables", "Live Music"]}
//   isOpen={true}
//   onSelect={() => navigate('/bar/millers-downtown')}
// />

import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface BarCardProps {
  imageSrc: string;           // URL or import of the venue's image
  name: string;               // Venue name
  tags: string[];             // e.g. ["Patio", "Pool Tables"]
  isOpen: boolean;            // true if open now
  onSelect: () => void;       // handler for tapping the card
}

export const BarCard: React.FC<BarCardProps> = ({
  imageSrc,
  name,
  tags,
  isOpen,
  onSelect
}) => {
  return (
    <div
      className="bg-card rounded-md shadow-sm overflow-hidden cursor-pointer border border-border hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
    >
      {/* Image */}
      <div className="relative">
        <ImageWithFallback
          src={imageSrc}
          alt={`${name} interior or exterior view`}
          className="w-full h-32 object-cover"
        />
        
        {/* Status Overlay */}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              isOpen
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Name */}
        <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
          {name}
        </h3>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};