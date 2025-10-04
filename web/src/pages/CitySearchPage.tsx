// src/pages/CitySearchPage.tsx - 现代化城市搜索页面

import React, { useState } from 'react';
import { Search, X, Star, Plus, MapPin, Clock, History, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen">
      <div className="container-modern py-8 space-y-modern">
        {/* 页面头部 */}
        <div className="card-modern p-6 animate-fade-in">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-modern-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-heading-2 text-white font-bold">城市搜索</h1>
              <p className="text-body">搜索全球城市并添加到主页</p>
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder="搜索城市名称、国家或时区..."
              className="input-modern w-full pl-12 pr-12 py-4 text-lg"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-modern"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* 搜索历史 */}
        {!searchQuery && searchHistory.length > 0 && (
          <div className="card-modern p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <History className="w-6 h-6 text-blue-400" />
                <h3 className="text-heading-3 text-white font-bold">搜索历史</h3>
              </div>
              <button
                onClick={clearSearchHistory}
                className="text-white/60 hover:text-white text-sm transition-modern"
              >
                清除历史
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {searchHistory.map((query, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(query);
                    handleSearch(query);
                  }}
                  className="px-4 py-2 bg-modern-lg border-modern text-white rounded-modern text-sm hover:bg-modern transition-modern"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 热门城市 */}
        {!searchQuery && (
          <div className="card-modern p-6 animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <h3 className="text-heading-3 text-white font-bold">热门城市</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TimezoneUtils.getSupportedTimezones().slice(0, 8).map((city) => (
                <button
                  key={city.timezone}
                  onClick={() => handleAddCity(city)}
                  className="card-modern p-4 text-left hover-lift group"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 rounded-modern bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{city.name}</div>
                      <div className="text-white/60 text-xs">{city.country}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-white/60">
                    <Clock className="w-3 h-3" />
                    <span>{city.offset}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* 搜索结果 */}
        {searchQuery && (
          <div className="animate-fade-in">
            <div className="card-modern p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Search className="w-6 h-6 text-blue-400" />
                  <h3 className="text-heading-3 text-white font-bold">
                    搜索结果 ({searchResults.length})
                  </h3>
                </div>
                {isSearching && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                )}
              </div>
            </div>
            
            {isSearching ? (
              <div className="card-modern p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-body">正在搜索...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid-cities">
                {searchResults.map((city, index) => (
                  <div 
                    key={city.timezone} 
                    className="city-card-modern animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-modern bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">{city.name}</h4>
                          <p className="text-white/60 text-sm">{city.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isFavorite(city) && (
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        )}
                        <button
                          onClick={() => handleAddCity(city)}
                          className="p-2 rounded-modern bg-modern-lg border-modern text-white hover:bg-modern transition-modern"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <Clock className="w-4 h-4" />
                        <span>时区: {city.timezone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span>偏移: {city.offset}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-modern p-12 text-center">
                <div className="w-20 h-20 rounded-modern-lg bg-modern-lg flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-white/60" />
                </div>
                <h3 className="text-heading-3 text-white mb-3">未找到相关城市</h3>
                <p className="text-body">请尝试其他搜索关键词</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 底部间距 */}
      <div className="h-20"></div>
    </div>
  );
};
