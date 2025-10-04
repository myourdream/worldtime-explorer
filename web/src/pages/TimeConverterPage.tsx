// src/pages/TimeConverterPage.tsx - 时区转换页面

import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, History } from 'lucide-react';
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
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-6">
        {/* 页面头部 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">时区转换</h1>
          <p className="text-white/80">在不同时区间转换时间</p>
        </div>
        
        {/* 转换器 */}
        <div className="card-gradient rounded-xl p-6 mb-6">
          {/* 自定义时间输入 */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">自定义时间（可选）</label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="格式: 2024/01/01 12:00:00"
                className="flex-1 px-3 py-2 bg-white/20 text-white placeholder-white/60 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                onClick={useCurrentTime}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <Clock className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/60 text-sm mt-1">留空则使用当前时间</p>
          </div>
          
          {/* 时区选择 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 源时区 */}
            <div>
              <label className="block text-white font-medium mb-2">源时区</label>
              <select
                value={fromTimezone}
                onChange={(e) => setFromTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                {allTimezones.map((tz) => (
                  <option key={tz.timezone} value={tz.timezone} className="bg-gray-800">
                    {tz.name} ({tz.country})
                  </option>
                ))}
              </select>
            </div>
            
            {/* 交换按钮 */}
            <div className="flex items-end justify-center">
              <button
                onClick={swapTimezones}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* 目标时区 */}
            <div>
              <label className="block text-white font-medium mb-2">目标时区</label>
              <select
                value={toTimezone}
                onChange={(e) => setToTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                {allTimezones.map((tz) => (
                  <option key={tz.timezone} value={tz.timezone} className="bg-gray-800">
                    {tz.name} ({tz.country})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* 转换按钮 */}
          <div className="text-center mb-6">
            <button
              onClick={convertTime}
              disabled={isConverting}
              className="px-8 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              {isConverting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>转换中...</span>
                </div>
              ) : (
                '转换时间'
              )}
            </button>
          </div>
          
          {/* 转换结果 */}
          {convertedTime && (
            <div className="text-center">
              <div className="card-gradient rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">转换结果</h3>
                <div className="text-2xl font-mono font-bold text-white mb-2">
                  {convertedTime}
                </div>
                <div className="text-sm text-white/80">
                  时间差: {timeDifference > 0 ? '+' : ''}{timeDifference.toFixed(1)}小时
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 转换历史 */}
        {conversionHistory.length > 0 && (
          <div className="card-gradient rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <History className="w-5 h-5 mr-2" />
                转换历史
              </h3>
              <button
                onClick={clearConversionHistory}
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                清除历史
              </button>
            </div>
            
            <div className="space-y-3">
              {conversionHistory.slice(0, 10).map((record, index) => (
                <div key={index} className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">
                      {TimezoneUtils.getTimezoneInfo(record.from)?.name} → {TimezoneUtils.getTimezoneInfo(record.to)?.name}
                    </div>
                    <div className="text-white/60 text-sm">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-white/80">
                    <div>源时间: {record.time}</div>
                    <div>结果: {record.result}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
