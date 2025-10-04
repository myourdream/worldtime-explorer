// shared/constants.ts - 常量定义

export const APP_NAME = '世界时间查看器';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = '实时查看全球主要城市时间，支持城市搜索和时区转换功能';

// 存储键名
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  SELECTED_CITIES: 'selected_cities',
  FAVORITE_CITIES: 'favorite_cities',
  SEARCH_HISTORY: 'search_history',
  CONVERSION_HISTORY: 'conversion_history'
} as const;

// 用户偏好设置
export const USER_PREFERENCES = {
  DEFAULT_TIMEZONE: 'Asia/Shanghai',
  SHOW_SECONDS: true,
  AUTO_REFRESH: true,
  REFRESH_INTERVAL: 1000,
  THEME: 'light'
} as const;

// 时间格式
export const TIME_FORMATS = {
  FULL: {
    year: true,
    month: true,
    day: true,
    hour: true,
    minute: true,
    second: true
  },
  DATE_ONLY: {
    year: true,
    month: true,
    day: true
  },
  TIME_ONLY: {
    hour: true,
    minute: true,
    second: true
  },
  TIME_SHORT: {
    hour: true,
    minute: true
  }
} as const;

// 默认城市列表
export const DEFAULT_CITIES = [
  { name: '北京', timezone: 'Asia/Shanghai', country: '中国', offset: '+08:00' },
  { name: '东京', timezone: 'Asia/Tokyo', country: '日本', offset: '+09:00' },
  { name: '纽约', timezone: 'America/New_York', country: '美国', offset: '-05:00' },
  { name: '伦敦', timezone: 'Europe/London', country: '英国', offset: '+00:00' },
  { name: '巴黎', timezone: 'Europe/Paris', country: '法国', offset: '+01:00' },
  { name: '悉尼', timezone: 'Australia/Sydney', country: '澳大利亚', offset: '+10:00' }
];

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  TIMEZONE_ERROR: '时区信息获取失败',
  SEARCH_ERROR: '搜索失败，请重试',
  CONVERSION_ERROR: '时区转换失败',
  STORAGE_ERROR: '数据存储失败',
  UNKNOWN_ERROR: '未知错误，请重试'
} as const;

// 成功消息
export const SUCCESS_MESSAGES = {
  CITY_FAVORITED: '已添加到收藏',
  CITY_UNFAVORITED: '已取消收藏',
  CITY_ADDED: '城市添加成功',
  CITY_REMOVED: '城市移除成功',
  CONVERSION_SUCCESS: '转换成功',
  SETTINGS_SAVED: '设置已保存'
} as const;

// 时区分组
export const TIMEZONE_GROUPS = {
  ASIA: '亚洲',
  EUROPE: '欧洲',
  AMERICA: '美洲',
  OCEANIA: '大洋洲',
  AFRICA: '非洲'
} as const;

// 主题颜色
export const THEME_COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#27ae60',
  WARNING: '#f39c12',
  ERROR: '#e74c3c',
  INFO: '#3498db'
} as const;
