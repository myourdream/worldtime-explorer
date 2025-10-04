// src/components/CityCard.tsx - 城市卡片组件

import React, { useState } from 'react';
import { Heart, MapPin, Clock, Star } from 'lucide-react';
import { TimezoneInfo } from '@shared/timezone';
import { TimeDisplay } from './TimeDisplay';
import { useTimeStore } from '../store/timeStore';

interface CityCardProps {
  city: TimezoneInfo;
  showRemove?: boolean;
  onRemove?: (timezone: string) => void;
  onTap?: (city: TimezoneInfo) => void;
  className?: string;
}

export const CityCard: React.FC<CityCardProps> = ({
  city,
  showRemove = false,
  onRemove,
  onTap,
  className = ''
}) => {
  const { favoriteCities, toggleFavorite } = useTimeStore();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isFavorite = favoriteCities.some(fav => fav.timezone === city.timezone);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    toggleFavorite(city);
    
    // 动画结束后重置状态
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(city.timezone);
    }
  };
  
  const handleCardClick = () => {
    if (onTap) {
      onTap(city);
    }
  };
  
  return (
    <div 
      className={`
        card-gradient rounded-lg p-4 cursor-pointer transition-all duration-300
        hover:scale-105 hover:shadow-lg
        ${isAnimating ? 'animate-pulse' : ''}
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* 头部信息 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-primary" />
          <div>
            <h3 className="font-semibold text-white">{city.name}</h3>
            <p className="text-sm text-white/80">{city.country}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 收藏按钮 */}
          <button
            onClick={handleFavoriteClick}
            className={`
              p-1 rounded-full transition-all duration-200
              ${isFavorite 
                ? 'text-yellow-400 hover:text-yellow-300' 
                : 'text-white/60 hover:text-white'
              }
            `}
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} 
            />
          </button>
          
          {/* 移除按钮 */}
          {showRemove && (
            <button
              onClick={handleRemoveClick}
              className="p-1 rounded-full text-white/60 hover:text-red-400 transition-colors"
            >
              <Star className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* 时间显示 */}
      <div className="mb-3">
        <TimeDisplay
          timezone={city.timezone}
          format="TIME_ONLY"
          showSeconds={true}
          size="large"
          className="text-white"
        />
      </div>
      
      {/* 时区信息 */}
      <div className="flex items-center justify-between text-sm text-white/80">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>{city.offset}</span>
        </div>
        
        <div className="text-xs">
          {city.timezone.split('/')[1]?.replace('_', ' ')}
        </div>
      </div>
      
      {/* 收藏状态指示 */}
      {isFavorite && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
};
