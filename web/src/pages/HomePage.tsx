// src/pages/HomePage.tsx - 现代化首页组件

import React, { useEffect } from 'react';
import { RefreshCcw, Settings, Search, Clock, Globe, Star } from 'lucide-react';
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
    removeCity,
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="container-modern py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">世界时间</h1>
                <p className="text-sm text-gray-600">实时查看全球主要城市时间</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button className="p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 主要内容 */}
      <div className="container-modern py-8">
        {/* 当前时间区域 */}
        <div className="mb-8">
          <div className="modern-card p-8 text-center animate-fade-in">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">当前时间</h2>
            </div>
            
            <TimeDisplay
              timezone={localTimezone}
              format="FULL"
              showSeconds={true}
              showDate={true}
              size="large"
              className="mb-4"
            />
            
            {hasError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errorMessage}</p>
                <button
                  onClick={clearError}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm underline"
                >
                  清除错误
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* 城市列表区域 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">主要城市</h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {cities.length}个城市
              </span>
            </div>
            
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>搜索城市</span>
            </button>
          </div>
          
          {/* 城市网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          
          {cities.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">暂无城市</h3>
              <p className="text-gray-400 mb-4">添加一些城市来开始使用</p>
              <button className="btn-primary">
                添加城市
              </button>
            </div>
          )}
        </div>
        
        {/* 快速操作区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="modern-card p-6 text-center hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">搜索城市</h3>
            <p className="text-gray-600 text-sm">查找全球任意城市的时间</p>
          </div>
          
          <div className="modern-card p-6 text-center hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">时区转换</h3>
            <p className="text-gray-600 text-sm">快速转换不同时区的时间</p>
          </div>
          
          <div className="modern-card p-6 text-center hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">收藏管理</h3>
            <p className="text-gray-600 text-sm">管理您收藏的城市列表</p>
          </div>
        </div>
      </div>
      
      {/* 底部导航栏 */}
      <div className="nav-bar">
        <div className="container-modern py-4">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center space-y-1 text-indigo-600">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">首页</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-gray-500 hover:text-indigo-600 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">搜索</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-gray-500 hover:text-indigo-600 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">转换</span>
            </button>
            
            <button className="flex flex-col items-center space-y-1 text-gray-500 hover:text-indigo-600 transition-colors">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium">设置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};