// Example usage:
// <Card header={<h3>Flight Details</h3>} footer={<Button variant="primary">Book Now</Button>}>
//   <p>Flight content goes here...</p>
// </Card>

import React from 'react';

interface CardProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  header,
  children,
  footer,
  className = '',
}) => {
  const baseClasses = 'bg-card border border-border rounded-lg shadow-sm overflow-hidden';
  const classes = `${baseClasses} ${className}`;
  
  return (
    <div className={classes}>
      {header && (
        <div className="px-6 py-4 border-b border-border">
          {header}
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-muted/50">
          {footer}
        </div>
      )}
    </div>
  );
};