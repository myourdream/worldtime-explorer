// src/pages/HomePage.tsx - 现代化首页组件

import React, { useEffect } from 'react';
import { RefreshCcw, Settings, Search, Clock, Globe, Star, Plus } from 'lucide-react';
import { CityCard } from '../components/CityCard';
import { TimeDisplay } from '../components/TimeDisplay';
import { useTimeStore } from '../store/timeStore';

export const HomePage: React.FC = () => {
  const {
    cities,
    localTimezone,
    isLoading,
    hasError,
    errorMessage,
    updateCurrentTime,
    setLoading,
    clearError,
    loadFromStorage
  } = useTimeStore();
  
  // 初始化
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);
  
  // 刷新时间
  const handleRefresh = () => {
    setLoading(true);
    updateCurrentTime();
    setTimeout(() => setLoading(false), 1000);
  };
  
  return (
    <div className="min-h-screen">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-modern-lg backdrop-blur-xl border-b border-modern">
        <div className="container-modern py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-modern-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-modern-lg">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-heading-2 text-white font-bold">世界时间</h1>
                <p className="text-caption">实时查看全球主要城市时间</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-3 rounded-modern bg-modern border-modern text-white hover:bg-modern-lg transition-modern disabled:opacity-50"
              >
                <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button className="p-3 rounded-modern bg-modern border-modern text-white hover:bg-modern-lg transition-modern">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主要内容 */}
      <div className="container-modern py-8 space-y-modern">
        {/* 当前时间区域 */}
        <div className="card-modern p-8 text-center animate-fade-in">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-modern bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-heading-3 text-white font-bold">当前时间</h2>
          </div>
          
          <div className="bg-modern-lg rounded-modern-lg p-6 mb-6">
            <TimeDisplay
              timezone={localTimezone}
              format="FULL"
              showSeconds={true}
              showDate={true}
              size="large"
              className="time-display-modern"
            />
          </div>
          
          {hasError && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-modern p-4 animate-fade-in">
              <p className="text-red-300 text-sm mb-2">{errorMessage}</p>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-300 text-sm underline transition-modern"
              >
                清除错误
              </button>
            </div>
          )}
        </div>
        
        {/* 城市列表区域 */}
        <div className="space-y-modern">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-modern bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-heading-3 text-white font-bold">主要城市</h2>
                <p className="text-caption">{cities.length}个城市</p>
              </div>
            </div>
            
            <button className="btn-primary flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>搜索城市</span>
            </button>
          </div>
          
          {/* 城市网格 */}
          {cities.length > 0 ? (
            <div className="grid-cities">
              {cities.map((city, index) => (
                <div
                  key={city.timezone}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CityCard
                    city={city}
                    showRemove={false}
                    onTap={(city) => {
                      console.log('点击城市:', city.name);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="card-modern p-12 text-center">
              <div className="w-20 h-20 rounded-modern-lg bg-modern-lg flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white/60" />
              </div>
              <h3 className="text-heading-3 text-white mb-3">暂无城市</h3>
              <p className="text-body mb-6">添加一些城市来开始使用</p>
              <button className="btn-primary flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>添加城市</span>
              </button>
            </div>
          )}
        </div>
        
        {/* 快速操作区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-modern p-6 text-center hover-lift group cursor-pointer">
            <div className="w-16 h-16 rounded-modern-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-modern">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-heading-3 text-white mb-2">搜索城市</h3>
            <p className="text-body">查找全球任意城市的时间</p>
          </div>
          
          <div className="card-modern p-6 text-center hover-lift group cursor-pointer">
            <div className="w-16 h-16 rounded-modern-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-modern">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-heading-3 text-white mb-2">时区转换</h3>
            <p className="text-body">快速转换不同时区的时间</p>
          </div>
          
          <div className="card-modern p-6 text-center hover-lift group cursor-pointer">
            <div className="w-16 h-16 rounded-modern-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-modern">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-heading-3 text-white mb-2">收藏管理</h3>
            <p className="text-body">管理您收藏的城市列表</p>
          </div>
        </div>
      </div>
      
      {/* 底部间距 */}
      <div className="h-20"></div>
    </div>
  );
};