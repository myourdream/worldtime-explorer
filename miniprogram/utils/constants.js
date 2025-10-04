// utils/constants.js - 常量定义

/**
 * 应用常量定义
 */
const Constants = {
  
  // 应用信息
  APP_NAME: '世界时间查看器',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: '一个功能强大的世界时间查看和转换工具',
  
  // 默认城市列表
  DEFAULT_CITIES: [
    { name: '北京', timezone: 'Asia/Shanghai', country: '中国', flag: '🇨🇳' },
    { name: '纽约', timezone: 'America/New_York', country: '美国', flag: '🇺🇸' },
    { name: '伦敦', timezone: 'Europe/London', country: '英国', flag: '🇬🇧' },
    { name: '东京', timezone: 'Asia/Tokyo', country: '日本', flag: '🇯🇵' },
    { name: '悉尼', timezone: 'Australia/Sydney', country: '澳大利亚', flag: '🇦🇺' },
    { name: '巴黎', timezone: 'Europe/Paris', country: '法国', flag: '🇫🇷' }
  ],

  // 时区组
  TIMEZONE_GROUPS: {
    ASIA: {
      name: '亚洲',
      timezones: [
        'Asia/Shanghai', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Hong_Kong',
        'Asia/Singapore', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Manila',
        'Asia/Kolkata', 'Asia/Dubai'
      ]
    },
    EUROPE: {
      name: '欧洲',
      timezones: [
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome',
        'Europe/Madrid', 'Europe/Moscow', 'Europe/Amsterdam', 'Europe/Zurich'
      ]
    },
    AMERICA: {
      name: '美洲',
      timezones: [
        'America/New_York', 'America/Los_Angeles', 'America/Chicago',
        'America/Toronto', 'America/Vancouver', 'America/Mexico_City',
        'America/Sao_Paulo', 'America/Argentina/Buenos_Aires'
      ]
    },
    OCEANIA: {
      name: '大洋洲',
      timezones: [
        'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland', 'Pacific/Fiji'
      ]
    },
    AFRICA: {
      name: '非洲',
      timezones: [
        'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi'
      ]
    }
  },

  // 时间格式
  TIME_FORMATS: {
    FULL: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    DATE_ONLY: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    TIME_ONLY: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    },
    SHORT_TIME: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }
  },

  // 颜色主题
  COLORS: {
    PRIMARY: '#667eea',
    SECONDARY: '#764ba2',
    SUCCESS: '#27ae60',
    WARNING: '#f39c12',
    DANGER: '#e74c3c',
    INFO: '#3498db',
    LIGHT: '#ecf0f1',
    DARK: '#2c3e50',
    WHITE: '#ffffff',
    BLACK: '#000000'
  },

  // 渐变背景
  GRADIENTS: {
    PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    SUCCESS: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
    WARNING: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    DANGER: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    INFO: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    DARK: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
  },

  // 动画配置
  ANIMATIONS: {
    DURATION: {
      FAST: 200,
      NORMAL: 300,
      SLOW: 500
    },
    EASING: {
      EASE_IN: 'ease-in',
      EASE_OUT: 'ease-out',
      EASE_IN_OUT: 'ease-in-out'
    }
  },

  // 存储键名
  STORAGE_KEYS: {
    SELECTED_CITIES: 'selected_cities',
    USER_PREFERENCES: 'user_preferences',
    SEARCH_HISTORY: 'search_history',
    FAVORITE_CITIES: 'favorite_cities'
  },

  // 用户偏好设置
  USER_PREFERENCES: {
    DEFAULT_TIMEZONE: 'Asia/Shanghai',
    TIME_FORMAT: '24h', // 12h or 24h
    DATE_FORMAT: 'YYYY-MM-DD',
    SHOW_SECONDS: true,
    AUTO_REFRESH: true,
    REFRESH_INTERVAL: 1000, // 毫秒
    THEME: 'light' // light or dark
  },

  // 错误消息
  ERROR_MESSAGES: {
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    TIMEZONE_ERROR: '时区信息获取失败',
    SEARCH_ERROR: '搜索失败，请重试',
    CONVERSION_ERROR: '时间转换失败',
    PERMISSION_ERROR: '权限不足，无法获取位置信息',
    UNKNOWN_ERROR: '未知错误，请重试'
  },

  // 成功消息
  SUCCESS_MESSAGES: {
    CITY_ADDED: '城市添加成功',
    CITY_REMOVED: '城市移除成功',
    CITY_FAVORITED: '已添加到收藏',
    CITY_UNFAVORITED: '已取消收藏',
    SETTINGS_SAVED: '设置保存成功',
    DATA_SYNCED: '数据同步成功'
  },

  // 提示消息
  TIPS: {
    SEARCH_TIP: '输入城市名称或国家名称进行搜索',
    CONVERSION_TIP: '选择源时区和目标时区进行时间转换',
    FAVORITE_TIP: '长按城市卡片可以添加到收藏',
    REFRESH_TIP: '下拉页面可以刷新时间数据'
  },

  // API配置
  API: {
    BASE_URL: 'https://api.worldtime.io',
    TIMEOUT: 10000,
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000
  },

  // 云开发配置
  CLOUD: {
    ENV_ID: 'worldtime-explorer',
    FUNCTIONS: {
      GET_WORLD_TIME: 'get-world-time',
      SEARCH_CITIES: 'search-cities',
      GET_TIMEZONE_INFO: 'get-timezone-info'
    }
  },

  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100
  },

  // 缓存配置
  CACHE: {
    TIMEZONE_DATA_TTL: 24 * 60 * 60 * 1000, // 24小时
    CITY_SEARCH_TTL: 60 * 60 * 1000, // 1小时
    USER_PREFERENCES_TTL: 7 * 24 * 60 * 60 * 1000 // 7天
  },

  // 性能配置
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 1000,
    MAX_CONCURRENT_REQUESTS: 5
  },

  // 国际化支持的语言
  SUPPORTED_LANGUAGES: [
    { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
    { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
    { code: 'ko-KR', name: '한국어', flag: '🇰🇷' }
  ],

  // 默认语言
  DEFAULT_LANGUAGE: 'zh-CN',

  // 特殊时区
  SPECIAL_TIMEZONES: {
    UTC: 'UTC',
    GMT: 'GMT',
    LOCAL: 'local'
  },

  // 时区偏移量（小时）
  TIMEZONE_OFFSETS: {
    'UTC': 0,
    'GMT': 0,
    'Asia/Shanghai': 8,
    'Asia/Tokyo': 9,
    'America/New_York': -5,
    'America/Los_Angeles': -8,
    'Europe/London': 0,
    'Europe/Paris': 1,
    'Australia/Sydney': 10
  }
}

module.exports = Constants
