// src/pages/HomePage.tsx - 首页

import React, { useEffect } from 'react';
import { Search, RefreshCw, Settings, Plus } from 'lucide-react';
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
  
  // 自动更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      updateCurrentTime();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [updateCurrentTime]);
  
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      updateCurrentTime();
      setLoading(false);
    }, 1000);
  };
  
  const handleCityRemove = (timezone: string) => {
    removeCity(timezone);
  };
  
  const handleCityTap = (city: any) => {
    console.log('点击城市:', city.name);
    // 可以显示城市详情或跳转到详情页
  };
  
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">世界时间</h1>
            <p className="text-white/80">实时查看全球主要城市时间</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* 当前时间显示 */}
        <div className="mb-8">
          <div className="card-gradient rounded-xl p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white mb-4">当前时间</h2>
              <TimeDisplay
                timezone={localTimezone}
                format="FULL"
                showSeconds={true}
                showDate={true}
                size="large"
                className="text-white"
              />
            </div>
          </div>
        </div>
        
        {/* 城市列表 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">主要城市</h2>
            <span className="text-white/80 text-sm">{cities.length}个城市</span>
          </div>
          
          {/* 加载状态 */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-2 text-white">正在加载城市时间...</span>
            </div>
          )}
          
          {/* 城市卡片列表 */}
          {!isLoading && cities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((city) => (
                <CityCard
                  key={city.timezone}
                  city={city}
                  showRemove={true}
                  onRemove={handleCityRemove}
                  onTap={handleCityTap}
                />
              ))}
            </div>
          )}
          
          {/* 空状态 */}
          {!isLoading && cities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">暂无城市数据</h3>
              <p className="text-white/80 mb-6">添加一些城市来开始使用</p>
              <button className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                <Plus className="w-5 h-5 inline mr-2" />
                添加城市
              </button>
            </div>
          )}
          
          {/* 错误状态 */}
          {hasError && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-white mb-2">加载失败</h3>
              <p className="text-white/80 mb-6">{errorMessage}</p>
              <button
                onClick={() => {
                  clearError();
                  handleRefresh();
                }}
                className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                重试
              </button>
            </div>
          )}
        </div>
        
        {/* 快捷操作 */}
        <div className="grid grid-cols-3 gap-4">
          <button className="card-gradient rounded-lg p-4 text-center hover:scale-105 transition-transform">
            <Search className="w-6 h-6 text-white mx-auto mb-2" />
            <span className="text-white font-medium">搜索城市</span>
          </button>
          
          <button className="card-gradient rounded-lg p-4 text-center hover:scale-105 transition-transform">
            <RefreshCw className="w-6 h-6 text-white mx-auto mb-2" />
            <span className="text-white font-medium">时区转换</span>
          </button>
          
          <button className="card-gradient rounded-lg p-4 text-center hover:scale-105 transition-transform">
            <Settings className="w-6 h-6 text-white mx-auto mb-2" />
            <span className="text-white font-medium">设置</span>
          </button>
        </div>
        
        {/* 底部提示 */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            💡 点击城市卡片可以查看详情，长按可以添加到收藏
          </p>
        </div>
      </div>
    </div>
  );
};
