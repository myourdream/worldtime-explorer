// src/components/TimeDisplay.tsx - 时间显示组件

import React from 'react';
import { TimezoneUtils, TimezoneInfo } from '@shared/timezone';
import { TIME_FORMATS } from '@shared/constants';
import { useTimeStore } from '../store/timeStore';

interface TimeDisplayProps {
  timezone: string;
  cityInfo?: TimezoneInfo;
  format?: keyof typeof TIME_FORMATS;
  showSeconds?: boolean;
  showDate?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timezone,
  cityInfo,
  format = 'TIME_ONLY',
  showSeconds = true,
  showDate = false,
  size = 'medium',
  className = ''
}) => {
  const { showSeconds: globalShowSeconds } = useTimeStore();
  
  const displaySeconds = showSeconds !== undefined ? showSeconds : globalShowSeconds;
  const formatOptions = TIME_FORMATS[format];
  
  // 获取指定时区的时间
  const timeInTimezone = TimezoneUtils.getCurrentTime(timezone);
  
  // 格式化时间
  const formattedTime = TimezoneUtils.formatTime(timeInTimezone, timezone, {
    ...formatOptions,
    second: displaySeconds && 'second' in formatOptions ? formatOptions.second : false
  });
  
  // 格式化日期
  const formattedDate = showDate 
    ? TimezoneUtils.formatTime(timeInTimezone, timezone, TIME_FORMATS.DATE_ONLY)
    : '';
  
  // 获取星期
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayOfWeek = dayNames[timeInTimezone.getDay()];
  
  // 获取时区偏移
  const offset = TimezoneUtils.getTimezoneOffset(timezone);
  const offsetStr = offset >= 0 ? `+${offset.toFixed(1)}` : `${offset.toFixed(1)}`;
  
  // 尺寸样式
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };
  
  return (
    <div className={`time-display ${sizeClasses[size]} ${className}`}>
      {/* 城市信息 */}
      {cityInfo && (
        <div className="mb-2">
          <h3 className="font-semibold text-foreground">{cityInfo.name}</h3>
          <p className="text-sm text-muted-foreground">{cityInfo.country}</p>
        </div>
      )}
      
      {/* 时间显示 */}
      <div className="font-mono font-bold text-primary">
        {formattedTime}
      </div>
      
      {/* 日期显示 */}
      {showDate && formattedDate && (
        <div className="text-sm text-muted-foreground mt-1">
          {formattedDate} {dayOfWeek}
        </div>
      )}
      
      {/* 时区信息 */}
      <div className="text-xs text-muted-foreground mt-1">
        UTC{offsetStr}
      </div>
    </div>
  );
};
