// src/components/CityCard.tsx - 现代化城市卡片组件

import React, { useState } from 'react';
import { Heart, MapPin, Clock, Star, Plus } from 'lucide-react';
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
        city-card group relative overflow-hidden
        ${isAnimating ? 'animate-pulse' : ''}
        ${className}
      `}
      onClick={handleCardClick}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* 卡片内容 */}
      <div className="relative z-10">
        {/* 头部信息 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                {city.name}
              </h3>
              <p className="text-sm text-gray-600 font-medium">{city.country}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 收藏按钮 */}
            <button
              onClick={handleFavoriteClick}
              className={`
                p-2 rounded-full transition-all duration-200 transform hover:scale-110
                ${isFavorite 
                  ? 'bg-yellow-100 text-yellow-600 shadow-md' 
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
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
                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            )}
          </div>
        </div>
        
        {/* 时间显示区域 */}
        <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <TimeDisplay
            timezone={city.timezone}
            format="TIME_ONLY"
            showSeconds={true}
            size="large"
            className="text-center"
          />
        </div>
        
        {/* 时区信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">{city.offset}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{city.timezone.split('/')[1]?.replace('_', ' ')}</span>
            </div>
          </div>
          
          {/* 收藏状态指示 */}
          {isFavorite && (
            <div className="flex items-center space-x-1 text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-xs font-medium">已收藏</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 悬停效果装饰 */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
    </div>
  );
};