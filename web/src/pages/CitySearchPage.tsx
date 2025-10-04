// src/pages/CitySearchPage.tsx - 城市搜索页面

import React, { useState } from 'react';
import { Search, X, Star, Plus } from 'lucide-react';
import { TimezoneUtils, TimezoneInfo } from '@shared/timezone';
import { useTimeStore } from '../store/timeStore';

export const CitySearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TimezoneInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { 
    searchHistory, 
    addSearchHistory, 
    clearSearchHistory,
    addCity,
    favoriteCities 
  } = useTimeStore();
  
  // 搜索城市
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // 模拟搜索延迟
    setTimeout(() => {
      const results = TimezoneUtils.searchTimezones(query);
      setSearchResults(results);
      setIsSearching(false);
      
      // 添加到搜索历史
      if (query.trim()) {
        addSearchHistory(query.trim());
      }
    }, 300);
  };
  
  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };
  
  // 清除搜索
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // 添加城市到主页
  const handleAddCity = (city: TimezoneInfo) => {
    addCity(city);
    // 可以显示成功提示
    console.log(`已添加城市: ${city.name}`);
  };
  
  // 检查是否为收藏城市
  const isFavorite = (city: TimezoneInfo) => {
    return favoriteCities.some(fav => fav.timezone === city.timezone);
  };
  
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">城市搜索</h1>
            <p className="text-white/80">搜索全球城市并添加到主页</p>
          </div>
        </div>
        
        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="搜索城市名称、国家或时区..."
              className="w-full pl-10 pr-10 py-3 bg-white/20 text-white placeholder-white/60 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* 搜索历史 */}
        {!searchQuery && searchHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">搜索历史</h3>
              <button
                onClick={clearSearchHistory}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                清除历史
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(query);
                    handleSearch(query);
                  }}
                  className="px-3 py-1 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 热门城市 */}
        {!searchQuery && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">热门城市</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TimezoneUtils.getSupportedTimezones().slice(0, 8).map((city) => (
                <button
                  key={city.timezone}
                  onClick={() => handleAddCity(city)}
                  className="card-gradient rounded-lg p-3 text-left hover:scale-105 transition-transform"
                >
                  <div className="text-white font-medium text-sm">{city.name}</div>
                  <div className="text-white/80 text-xs">{city.country}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 搜索结果 */}
        {searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                搜索结果 ({searchResults.length})
              </h3>
              {isSearching && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
            </div>
            
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-white/80">正在搜索...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((city) => (
                  <div key={city.timezone} className="card-gradient rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{city.name}</h4>
                        <p className="text-sm text-white/80">{city.country}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isFavorite(city) && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                        <button
                          onClick={() => handleAddCity(city)}
                          className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-white/80">
                      <div>时区: {city.timezone}</div>
                      <div>偏移: {city.offset}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">未找到相关城市</h3>
                <p className="text-white/80">请尝试其他搜索关键词</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
