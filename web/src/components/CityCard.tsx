// src/components/CityCard.tsx - 现代化城市卡片组件

import React, { useState } from 'react';
import { Heart, MapPin, Clock, Star, X } from 'lucide-react';
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
        city-card-modern group relative overflow-hidden cursor-pointer
        ${isAnimating ? 'animate-pulse' : ''}
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* 卡片内容 */}
      <div className="relative z-10">
        {/* 头部信息 */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-modern-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-modern">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl group-hover:text-blue-300 transition-colors mb-1">
                {city.name}
              </h3>
              <p className="text-white/70 font-medium">{city.country}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 收藏按钮 */}
            <button
              onClick={handleFavoriteClick}
              className={`
                p-2 rounded-modern transition-modern transform hover:scale-110
                ${isFavorite 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-modern' 
                  : 'text-white/60 hover:text-yellow-400 hover:bg-yellow-500/20'
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
                className="p-2 rounded-modern text-white/60 hover:text-red-400 hover:bg-red-500/20 transition-modern"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* 时间显示区域 */}
        <div className="mb-6 p-6 bg-modern-lg rounded-modern-lg border-modern">
          <TimeDisplay
            timezone={city.timezone}
            format="TIME_ONLY"
            showSeconds={true}
            size="large"
            className="text-center time-display-modern"
          />
        </div>
        
        {/* 时区信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-white/70">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="font-mono font-semibold text-blue-300">{city.offset}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white/60">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="font-medium text-sm">{city.timezone.split('/')[1]?.replace('_', ' ')}</span>
            </div>
          </div>
          
          {/* 收藏状态指示 */}
          {isFavorite && (
            <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-modern">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">已收藏</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 悬停效果装饰 */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
    </div>
  );
};