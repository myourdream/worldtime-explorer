// cloudfunctions/get-world-time/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

/**
 * 获取世界时间云函数
 * @param {Object} event 事件参数
 * @param {string} event.timezone 时区
 * @param {Array} event.timezones 多个时区
 * @returns {Object} 时间信息
 */
exports.main = async (event, context) => {
  console.log('获取世界时间请求:', event)
  
  try {
    const { timezone, timezones } = event
    
    // 如果请求单个时区
    if (timezone) {
      const timeInfo = await getTimezoneTime(timezone)
      return {
        success: true,
        data: timeInfo,
        message: '获取时间成功'
      }
    }
    
    // 如果请求多个时区
    if (timezones && Array.isArray(timezones)) {
      const timeInfos = await Promise.all(
        timezones.map(tz => getTimezoneTime(tz))
      )
      return {
        success: true,
        data: timeInfos,
        message: '获取时间成功'
      }
    }
    
    // 默认返回当前UTC时间
    const utcTime = new Date()
    return {
      success: true,
      data: {
        timezone: 'UTC',
        time: utcTime.toISOString(),
        timestamp: utcTime.getTime(),
        formatted: utcTime.toLocaleString('zh-CN', {
          timeZone: 'UTC',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      },
      message: '获取UTC时间成功'
    }
    
  } catch (error) {
    console.error('获取世界时间失败:', error)
    return {
      success: false,
      error: error.message,
      message: '获取时间失败'
    }
  }
}

/**
 * 获取指定时区的时间
 * @param {string} timezone 时区
 * @returns {Object} 时间信息
 */
async function getTimezoneTime(timezone) {
  try {
    const now = new Date()
    
    // 获取时区时间
    const timeInTimezone = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    
    // 计算时区偏移
    const utcTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
    const offset = (timeInTimezone.getTime() - utcTime.getTime()) / (1000 * 60 * 60)
    
    // 格式化时间
    const formatted = now.toLocaleString('zh-CN', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    // 获取日期信息
    const dateInfo = now.toLocaleString('zh-CN', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long'
    })
    
    return {
      timezone: timezone,
      time: timeInTimezone.toISOString(),
      timestamp: timeInTimezone.getTime(),
      formatted: formatted,
      dateInfo: dateInfo,
      offset: offset,
      isDST: await checkDST(timezone),
      dayOfWeek: timeInTimezone.getDay(),
      dayOfYear: Math.floor((timeInTimezone - new Date(timeInTimezone.getFullYear(), 0, 0)) / 86400000)
    }
    
  } catch (error) {
    console.error(`获取时区 ${timezone} 时间失败:`, error)
    throw new Error(`时区 ${timezone} 无效或获取失败`)
  }
}

/**
 * 检查是否为夏令时
 * @param {string} timezone 时区
 * @returns {boolean} 是否为夏令时
 */
async function checkDST(timezone) {
  try {
    const now = new Date()
    const jan = new Date(now.getFullYear(), 0, 1)
    const jul = new Date(now.getFullYear(), 6, 1)
    
    const janOffset = getTimezoneOffset(timezone, jan)
    const julOffset = getTimezoneOffset(timezone, jul)
    
    return janOffset !== julOffset
  } catch (error) {
    console.error('检查夏令时失败:', error)
    return false
  }
}

/**
 * 获取时区偏移
 * @param {string} timezone 时区
 * @param {Date} date 日期
 * @returns {number} 偏移量（小时）
 */
function getTimezoneOffset(timezone, date) {
  try {
    const utc = new Date(date.getTime() + (date.getTimezoneOffset() * 60000))
    const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }))
    return (targetTime.getTime() - utc.getTime()) / (1000 * 60 * 60)
  } catch (error) {
    console.error('获取时区偏移失败:', error)
    return 0
  }
}
