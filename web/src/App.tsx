// src/App.tsx - 现代化主应用组件

import React, { useState } from 'react';
import { Home, Search, Clock, Settings } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { HomePage } from './pages/HomePage';
import { CitySearchPage } from './pages/CitySearchPage';
import { TimeConverterPage } from './pages/TimeConverterPage';

type Page = 'home' | 'search' | 'converter' | 'settings';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  // 初始化Speed Insights
  React.useEffect(() => {
    injectSpeedInsights();
  }, []);
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <CitySearchPage />;
      case 'converter':
        return <TimeConverterPage />;
      case 'settings':
        return (
          <div className="min-h-screen">
            <div className="container-modern py-8">
              <div className="card-modern p-12 text-center">
                <div className="w-20 h-20 rounded-modern-lg bg-modern-lg flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-10 h-10 text-white/60" />
                </div>
                <h1 className="text-heading-2 text-white mb-3">设置页面</h1>
                <p className="text-body">设置功能开发中...</p>
              </div>
            </div>
            <div className="h-20"></div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };
  
  return (
    <div className="App">
      {/* 主内容 */}
      <main className="pb-20">
        {renderPage()}
      </main>
      
      {/* 现代化底部导航 */}
      <nav className="nav-modern">
        <div className="container-modern py-4">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center py-2 px-4 rounded-modern transition-modern ${
                currentPage === 'home' 
                  ? 'text-white bg-modern-lg border-modern' 
                  : 'text-white/60 hover:text-white hover:bg-modern'
              }`}
            >
              <div className={`w-8 h-8 rounded-modern flex items-center justify-center mb-1 ${
                currentPage === 'home' ? 'bg-blue-500' : 'bg-transparent'
              }`}>
                <Home className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">首页</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('search')}
              className={`flex flex-col items-center py-2 px-4 rounded-modern transition-modern ${
                currentPage === 'search' 
                  ? 'text-white bg-modern-lg border-modern' 
                  : 'text-white/60 hover:text-white hover:bg-modern'
              }`}
            >
              <div className={`w-8 h-8 rounded-modern flex items-center justify-center mb-1 ${
                currentPage === 'search' ? 'bg-blue-500' : 'bg-transparent'
              }`}>
                <Search className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">搜索</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('converter')}
              className={`flex flex-col items-center py-2 px-4 rounded-modern transition-modern ${
                currentPage === 'converter' 
                  ? 'text-white bg-modern-lg border-modern' 
                  : 'text-white/60 hover:text-white hover:bg-modern'
              }`}
            >
              <div className={`w-8 h-8 rounded-modern flex items-center justify-center mb-1 ${
                currentPage === 'converter' ? 'bg-blue-500' : 'bg-transparent'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">转换</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('settings')}
              className={`flex flex-col items-center py-2 px-4 rounded-modern transition-modern ${
                currentPage === 'settings' 
                  ? 'text-white bg-modern-lg border-modern' 
                  : 'text-white/60 hover:text-white hover:bg-modern'
              }`}
            >
              <div className={`w-8 h-8 rounded-modern flex items-center justify-center mb-1 ${
                currentPage === 'settings' ? 'bg-blue-500' : 'bg-transparent'
              }`}>
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">设置</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Vercel Analytics */}
      <Analytics />
    </div>
  );
};
