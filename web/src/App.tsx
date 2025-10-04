// src/App.tsx - 主应用组件

import React, { useState } from 'react';
import { Home, Search, Clock, Settings } from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { CitySearchPage } from './pages/CitySearchPage';
import { TimeConverterPage } from './pages/TimeConverterPage';

type Page = 'home' | 'search' | 'converter' | 'settings';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <CitySearchPage />;
      case 'converter':
        return <TimeConverterPage />;
      case 'settings':
        return <div className="min-h-screen gradient-bg flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-4">设置页面</h1>
            <p className="text-white/80">设置功能开发中...</p>
          </div>
        </div>;
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
      
      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentPage === 'home' 
                  ? 'text-white bg-white/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">首页</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('search')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentPage === 'search' 
                  ? 'text-white bg-white/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-5 h-5 mb-1" />
              <span className="text-xs">搜索</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('converter')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentPage === 'converter' 
                  ? 'text-white bg-white/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clock className="w-5 h-5 mb-1" />
              <span className="text-xs">转换</span>
            </button>
            
            <button
              onClick={() => setCurrentPage('settings')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentPage === 'settings' 
                  ? 'text-white bg-white/20' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings className="w-5 h-5 mb-1" />
              <span className="text-xs">设置</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
