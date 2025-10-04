// src/pages/TimeConverterPage.tsx - 现代化时区转换页面

import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, History, RefreshCw, Calendar, Globe } from 'lucide-react';
import { TimezoneUtils } from '@shared/timezone';
import { useTimeStore } from '../store/timeStore';

export const TimeConverterPage: React.FC = () => {
  const [fromTimezone, setFromTimezone] = useState('Asia/Shanghai');
  const [toTimezone, setToTimezone] = useState('America/New_York');
  const [customTime, setCustomTime] = useState('');
  const [convertedTime, setConvertedTime] = useState('');
  const [timeDifference, setTimeDifference] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  
  const { 
    conversionHistory, 
    addConversionHistory,
    clearConversionHistory 
  } = useTimeStore();
  
  // 获取所有时区
  const allTimezones = TimezoneUtils.getSupportedTimezones();
  
  // 转换时间
  const convertTime = () => {
    setIsConverting(true);
    
    setTimeout(() => {
      try {
        let sourceTime: Date;
        
        if (customTime) {
          // 使用自定义时间
          const [datePart, timePart] = customTime.split(' ');
          const [year, month, day] = datePart.split('/').map(Number);
          const [hour, minute, second] = timePart.split(':').map(Number);
          sourceTime = new Date(year, month - 1, day, hour, minute, second || 0);
        } else {
          // 使用当前时间
          sourceTime = new Date();
        }
        
        // 转换时区
        const converted = TimezoneUtils.convertTimezone(sourceTime, fromTimezone, toTimezone);
        const formatted = TimezoneUtils.formatTime(converted, toTimezone, {
          year: true,
          month: true,
          day: true,
          hour: true,
          minute: true,
          second: true
        });
        
        setConvertedTime(formatted);
        
        // 计算时间差
        const diff = TimezoneUtils.getTimeDifference(toTimezone, fromTimezone);
        setTimeDifference(diff);
        
        // 添加到转换历史
        addConversionHistory({
          from: fromTimezone,
          to: toTimezone,
          time: customTime || TimezoneUtils.formatTime(sourceTime, fromTimezone, {
            year: true,
            month: true,
            day: true,
            hour: true,
            minute: true,
            second: true
          }),
          result: formatted,
          timestamp: Date.now()
        });
        
      } catch (error) {
        console.error('转换失败:', error);
        setConvertedTime('转换失败');
      } finally {
        setIsConverting(false);
      }
    }, 500);
  };
  
  // 交换时区
  const swapTimezones = () => {
    setFromTimezone(toTimezone);
    setToTimezone(fromTimezone);
  };
  
  // 使用当前时间
  const useCurrentTime = () => {
    const now = new Date();
    const formatted = TimezoneUtils.formatTime(now, fromTimezone, {
      year: true,
      month: true,
      day: true,
      hour: true,
      minute: true,
      second: true
    });
    setCustomTime(formatted);
  };
  
  // 自动转换
  useEffect(() => {
    if (fromTimezone && toTimezone) {
      convertTime();
    }
  }, [fromTimezone, toTimezone]);
  
  return (
    <div className="min-h-screen">
      <div className="container-modern py-8 space-y-modern">
        {/* 页面头部 */}
        <div className="card-modern p-6 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-modern-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-heading-2 text-white font-bold">时区转换</h1>
              <p className="text-body">在不同时区间转换时间</p>
            </div>
          </div>
        </div>
        
        {/* 转换器 */}
        <div className="card-modern p-8 animate-slide-up">
          {/* 自定义时间输入 */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-400" />
              <label className="text-white font-semibold text-lg">自定义时间（可选）</label>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="格式: 2024/01/01 12:00:00"
                className="input-modern flex-1 text-lg"
              />
              <button
                onClick={useCurrentTime}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>当前时间</span>
              </button>
            </div>
            <p className="text-caption mt-2">留空则使用当前时间</p>
          </div>
          
          {/* 时区选择 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* 源时区 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <label className="text-white font-semibold">源时区</label>
              </div>
              <select
                value={fromTimezone}
                onChange={(e) => setFromTimezone(e.target.value)}
                className="select-modern w-full text-lg"
              >
                {allTimezones.map((tz) => (
                  <option key={tz.timezone} value={tz.timezone}>
                    {tz.name} ({tz.country})
                  </option>
                ))}
              </select>
            </div>
            
            {/* 交换按钮 */}
            <div className="flex items-end justify-center">
              <button
                onClick={swapTimezones}
                className="p-4 rounded-modern-lg bg-modern-lg border-modern text-white hover:bg-modern transition-modern hover:scale-110"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
            
            {/* 目标时区 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <label className="text-white font-semibold">目标时区</label>
              </div>
              <select
                value={toTimezone}
                onChange={(e) => setToTimezone(e.target.value)}
                className="select-modern w-full text-lg"
              >
                {allTimezones.map((tz) => (
                  <option key={tz.timezone} value={tz.timezone}>
                    {tz.name} ({tz.country})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* 转换按钮 */}
          <div className="text-center mb-8">
            <button
              onClick={convertTime}
              disabled={isConverting}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50"
            >
              {isConverting ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>转换中...</span>
                </div>
              ) : (
                '转换时间'
              )}
            </button>
          </div>
          
          {/* 转换结果 */}
          {convertedTime && (
            <div className="animate-fade-in">
              <div className="card-modern p-8 text-center">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Clock className="w-6 h-6 text-green-400" />
                  <h3 className="text-heading-3 text-white font-bold">转换结果</h3>
                </div>
                <div className="bg-modern-lg rounded-modern-lg p-6 mb-4">
                  <div className="time-display-modern text-3xl mb-2">
                    {convertedTime}
                  </div>
                  <div className="text-body">
                    时间差: {timeDifference > 0 ? '+' : ''}{timeDifference.toFixed(1)}小时
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 转换历史 */}
        {conversionHistory.length > 0 && (
          <div className="card-modern p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <History className="w-6 h-6 text-blue-400" />
                <h3 className="text-heading-3 text-white font-bold">转换历史</h3>
              </div>
              <button
                onClick={clearConversionHistory}
                className="text-white/60 hover:text-white text-sm transition-modern"
              >
                清除历史
              </button>
            </div>
            
            <div className="space-y-4">
              {conversionHistory.slice(0, 10).map((record, index) => (
                <div 
                  key={index} 
                  className="bg-modern-lg border-modern rounded-modern p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-white font-semibold">
                      {TimezoneUtils.getTimezoneInfo(record.from)?.name} → {TimezoneUtils.getTimezoneInfo(record.to)?.name}
                    </div>
                    <div className="text-caption">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="text-white/80">
                      <span className="text-white/60">源时间:</span> {record.time}
                    </div>
                    <div className="text-white/80">
                      <span className="text-white/60">结果:</span> {record.result}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* 底部间距 */}
      <div className="h-20"></div>
    </div>
  );
};
