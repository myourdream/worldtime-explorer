// utils/timezone.js - 时区工具函数

/**
 * 时区工具类
 * 提供时区转换、时间格式化等功能
 */
class TimezoneUtils {
  
  /**
   * 获取所有支持的时区列表
   * @returns {Array} 时区列表
   */
  static getSupportedTimezones() {
    return [
      // 亚洲时区
      { name: '北京', timezone: 'Asia/Shanghai', country: '中国', offset: '+08:00' },
      { name: '东京', timezone: 'Asia/Tokyo', country: '日本', offset: '+09:00' },
      { name: '首尔', timezone: 'Asia/Seoul', country: '韩国', offset: '+09:00' },
      { name: '香港', timezone: 'Asia/Hong_Kong', country: '中国香港', offset: '+08:00' },
      { name: '新加坡', timezone: 'Asia/Singapore', country: '新加坡', offset: '+08:00' },
      { name: '曼谷', timezone: 'Asia/Bangkok', country: '泰国', offset: '+07:00' },
      { name: '雅加达', timezone: 'Asia/Jakarta', country: '印度尼西亚', offset: '+07:00' },
      { name: '马尼拉', timezone: 'Asia/Manila', country: '菲律宾', offset: '+08:00' },
      { name: '新德里', timezone: 'Asia/Kolkata', country: '印度', offset: '+05:30' },
      { name: '迪拜', timezone: 'Asia/Dubai', country: '阿联酋', offset: '+04:00' },
      
      // 欧洲时区
      { name: '伦敦', timezone: 'Europe/London', country: '英国', offset: '+00:00' },
      { name: '巴黎', timezone: 'Europe/Paris', country: '法国', offset: '+01:00' },
      { name: '柏林', timezone: 'Europe/Berlin', country: '德国', offset: '+01:00' },
      { name: '罗马', timezone: 'Europe/Rome', country: '意大利', offset: '+01:00' },
      { name: '马德里', timezone: 'Europe/Madrid', country: '西班牙', offset: '+01:00' },
      { name: '莫斯科', timezone: 'Europe/Moscow', country: '俄罗斯', offset: '+03:00' },
      { name: '阿姆斯特丹', timezone: 'Europe/Amsterdam', country: '荷兰', offset: '+01:00' },
      { name: '苏黎世', timezone: 'Europe/Zurich', country: '瑞士', offset: '+01:00' },
      
      // 美洲时区
      { name: '纽约', timezone: 'America/New_York', country: '美国', offset: '-05:00' },
      { name: '洛杉矶', timezone: 'America/Los_Angeles', country: '美国', offset: '-08:00' },
      { name: '芝加哥', timezone: 'America/Chicago', country: '美国', offset: '-06:00' },
      { name: '多伦多', timezone: 'America/Toronto', country: '加拿大', offset: '-05:00' },
      { name: '温哥华', timezone: 'America/Vancouver', country: '加拿大', offset: '-08:00' },
      { name: '墨西哥城', timezone: 'America/Mexico_City', country: '墨西哥', offset: '-06:00' },
      { name: '圣保罗', timezone: 'America/Sao_Paulo', country: '巴西', offset: '-03:00' },
      { name: '布宜诺斯艾利斯', timezone: 'America/Argentina/Buenos_Aires', country: '阿根廷', offset: '-03:00' },
      
      // 大洋洲时区
      { name: '悉尼', timezone: 'Australia/Sydney', country: '澳大利亚', offset: '+10:00' },
      { name: '墨尔本', timezone: 'Australia/Melbourne', country: '澳大利亚', offset: '+10:00' },
      { name: '奥克兰', timezone: 'Pacific/Auckland', country: '新西兰', offset: '+12:00' },
      { name: '斐济', timezone: 'Pacific/Fiji', country: '斐济', offset: '+12:00' },
      
      // 非洲时区
      { name: '开罗', timezone: 'Africa/Cairo', country: '埃及', offset: '+02:00' },
      { name: '约翰内斯堡', timezone: 'Africa/Johannesburg', country: '南非', offset: '+02:00' },
      { name: '拉各斯', timezone: 'Africa/Lagos', country: '尼日利亚', offset: '+01:00' },
      { name: '内罗毕', timezone: 'Africa/Nairobi', country: '肯尼亚', offset: '+03:00' }
    ]
  }

  /**
   * 根据关键词搜索时区
   * @param {string} keyword 搜索关键词
   * @returns {Array} 匹配的时区列表
   */
  static searchTimezones(keyword) {
    if (!keyword || keyword.trim() === '') {
      return this.getSupportedTimezones()
    }
    
    const searchTerm = keyword.toLowerCase().trim()
    return this.getSupportedTimezones().filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.country.toLowerCase().includes(searchTerm) ||
      item.timezone.toLowerCase().includes(searchTerm)
    )
  }

  /**
   * 获取指定时区的当前时间
   * @param {string} timezone 时区
   * @returns {Date} 当前时间
   */
  static getCurrentTime(timezone) {
    try {
      const now = new Date()
      return new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    } catch (error) {
      console.error('获取时区时间错误:', error)
      return new Date()
    }
  }

  /**
   * 格式化时间
   * @param {Date} date 时间对象
   * @param {string} timezone 时区
   * @param {Object} options 格式化选项
   * @returns {string} 格式化后的时间字符串
   */
  static formatTime(date, timezone = 'Asia/Shanghai', options = {}) {
    try {
      const defaultOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timezone
      }
      
      const formatOptions = { ...defaultOptions, ...options }
      return date.toLocaleString('zh-CN', formatOptions)
    } catch (error) {
      console.error('时间格式化错误:', error)
      return '时间格式错误'
    }
  }

  /**
   * 获取时区偏移量
   * @param {string} timezone 时区
   * @returns {number} 偏移量（小时）
   */
  static getTimezoneOffset(timezone) {
    try {
      const now = new Date()
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
      const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }))
      return (targetTime.getTime() - utc.getTime()) / (1000 * 60 * 60)
    } catch (error) {
      console.error('获取时区偏移错误:', error)
      return 0
    }
  }

  /**
   * 转换时间到指定时区
   * @param {Date} date 原始时间
   * @param {string} fromTimezone 源时区
   * @param {string} toTimezone 目标时区
   * @returns {Date} 转换后的时间
   */
  static convertTimezone(date, fromTimezone, toTimezone) {
    try {
      // 先转换到UTC
      const utcTime = new Date(date.toLocaleString('en-US', { timeZone: fromTimezone }))
      // 再转换到目标时区
      return new Date(utcTime.toLocaleString('en-US', { timeZone: toTimezone }))
    } catch (error) {
      console.error('时区转换错误:', error)
      return date
    }
  }

  /**
   * 计算两个时区的时间差
   * @param {string} timezone1 时区1
   * @param {string} timezone2 时区2
   * @returns {number} 时间差（小时）
   */
  static getTimeDifference(timezone1, timezone2) {
    try {
      const offset1 = this.getTimezoneOffset(timezone1)
      const offset2 = this.getTimezoneOffset(timezone2)
      return offset1 - offset2
    } catch (error) {
      console.error('计算时区差错误:', error)
      return 0
    }
  }

  /**
   * 获取时区信息
   * @param {string} timezone 时区
   * @returns {Object} 时区信息
   */
  static getTimezoneInfo(timezone) {
    const timezones = this.getSupportedTimezones()
    return timezones.find(tz => tz.timezone === timezone) || null
  }

  /**
   * 检查是否为夏令时
   * @param {string} timezone 时区
   * @returns {boolean} 是否为夏令时
   */
  static isDST(timezone) {
    try {
      const now = new Date()
      const jan = new Date(now.getFullYear(), 0, 1)
      const jul = new Date(now.getFullYear(), 6, 1)
      
      const janOffset = this.getTimezoneOffset(timezone)
      const julOffset = this.getTimezoneOffset(timezone)
      
      return janOffset !== julOffset
    } catch (error) {
      console.error('检查夏令时错误:', error)
      return false
    }
  }

  /**
   * 获取时间戳
   * @param {Date} date 时间对象
   * @returns {number} 时间戳
   */
  static getTimestamp(date = new Date()) {
    return Math.floor(date.getTime() / 1000)
  }

  /**
   * 从时间戳创建时间对象
   * @param {number} timestamp 时间戳
   * @returns {Date} 时间对象
   */
  static fromTimestamp(timestamp) {
    return new Date(timestamp * 1000)
  }

  /**
   * 获取相对时间描述
   * @param {Date} date 时间对象
   * @returns {string} 相对时间描述
   */
  static getRelativeTime(date) {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) {
      return '刚刚'
    } else if (minutes < 60) {
      return `${minutes}分钟前`
    } else if (hours < 24) {
      return `${hours}小时前`
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return this.formatTime(date, 'Asia/Shanghai', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }
  }
}

module.exports = TimezoneUtils
