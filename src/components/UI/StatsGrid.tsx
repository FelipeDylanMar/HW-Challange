import React from 'react';
import StatsCard, { type StatsCardProps } from './StatsCard';

export interface StatsGridProps {
  stats: StatsCardProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 3,
  className = ''
}) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={`${stat.title}-${index}`}
          {...stat}
        />
      ))}
    </div>
  );
};

export default StatsGrid;