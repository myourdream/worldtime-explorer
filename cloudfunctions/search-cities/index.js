// cloudfunctions/search-cities/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 城市数据库
const CITIES_DATABASE = [
  // 亚洲城市
  { name: '北京', timezone: 'Asia/Shanghai', country: '中国', countryCode: 'CN', flag: '🇨🇳', region: '亚洲' },
  { name: '上海', timezone: 'Asia/Shanghai', country: '中国', countryCode: 'CN', flag: '🇨🇳', region: '亚洲' },
  { name: '广州', timezone: 'Asia/Shanghai', country: '中国', countryCode: 'CN', flag: '🇨🇳', region: '亚洲' },
  { name: '深圳', timezone: 'Asia/Shanghai', country: '中国', countryCode: 'CN', flag: '🇨🇳', region: '亚洲' },
  { name: '香港', timezone: 'Asia/Hong_Kong', country: '中国香港', countryCode: 'HK', flag: '🇭🇰', region: '亚洲' },
  { name: '台北', timezone: 'Asia/Taipei', country: '中国台湾', countryCode: 'TW', flag: '🇹🇼', region: '亚洲' },
  { name: '东京', timezone: 'Asia/Tokyo', country: '日本', countryCode: 'JP', flag: '🇯🇵', region: '亚洲' },
  { name: '大阪', timezone: 'Asia/Tokyo', country: '日本', countryCode: 'JP', flag: '🇯🇵', region: '亚洲' },
  { name: '首尔', timezone: 'Asia/Seoul', country: '韩国', countryCode: 'KR', flag: '🇰🇷', region: '亚洲' },
  { name: '新加坡', timezone: 'Asia/Singapore', country: '新加坡', countryCode: 'SG', flag: '🇸🇬', region: '亚洲' },
  { name: '曼谷', timezone: 'Asia/Bangkok', country: '泰国', countryCode: 'TH', flag: '🇹🇭', region: '亚洲' },
  { name: '雅加达', timezone: 'Asia/Jakarta', country: '印度尼西亚', countryCode: 'ID', flag: '🇮🇩', region: '亚洲' },
  { name: '马尼拉', timezone: 'Asia/Manila', country: '菲律宾', countryCode: 'PH', flag: '🇵🇭', region: '亚洲' },
  { name: '新德里', timezone: 'Asia/Kolkata', country: '印度', countryCode: 'IN', flag: '🇮🇳', region: '亚洲' },
  { name: '孟买', timezone: 'Asia/Kolkata', country: '印度', countryCode: 'IN', flag: '🇮🇳', region: '亚洲' },
  { name: '迪拜', timezone: 'Asia/Dubai', country: '阿联酋', countryCode: 'AE', flag: '🇦🇪', region: '亚洲' },
  { name: '德黑兰', timezone: 'Asia/Tehran', country: '伊朗', countryCode: 'IR', flag: '🇮🇷', region: '亚洲' },
  { name: '伊斯坦布尔', timezone: 'Europe/Istanbul', country: '土耳其', countryCode: 'TR', flag: '🇹🇷', region: '亚洲' },
  
  // 欧洲城市
  { name: '伦敦', timezone: 'Europe/London', country: '英国', countryCode: 'GB', flag: '🇬🇧', region: '欧洲' },
  { name: '巴黎', timezone: 'Europe/Paris', country: '法国', countryCode: 'FR', flag: '🇫🇷', region: '欧洲' },
  { name: '柏林', timezone: 'Europe/Berlin', country: '德国', countryCode: 'DE', flag: '🇩🇪', region: '欧洲' },
  { name: '罗马', timezone: 'Europe/Rome', country: '意大利', countryCode: 'IT', flag: '🇮🇹', region: '欧洲' },
  { name: '马德里', timezone: 'Europe/Madrid', country: '西班牙', countryCode: 'ES', flag: '🇪🇸', region: '欧洲' },
  { name: '莫斯科', timezone: 'Europe/Moscow', country: '俄罗斯', countryCode: 'RU', flag: '🇷🇺', region: '欧洲' },
  { name: '阿姆斯特丹', timezone: 'Europe/Amsterdam', country: '荷兰', countryCode: 'NL', flag: '🇳🇱', region: '欧洲' },
  { name: '苏黎世', timezone: 'Europe/Zurich', country: '瑞士', countryCode: 'CH', flag: '🇨🇭', region: '欧洲' },
  { name: '维也纳', timezone: 'Europe/Vienna', country: '奥地利', countryCode: 'AT', flag: '🇦🇹', region: '欧洲' },
  { name: '布鲁塞尔', timezone: 'Europe/Brussels', country: '比利时', countryCode: 'BE', flag: '🇧🇪', region: '欧洲' },
  { name: '斯德哥尔摩', timezone: 'Europe/Stockholm', country: '瑞典', countryCode: 'SE', flag: '🇸🇪', region: '欧洲' },
  { name: '奥斯陆', timezone: 'Europe/Oslo', country: '挪威', countryCode: 'NO', flag: '🇳🇴', region: '欧洲' },
  { name: '哥本哈根', timezone: 'Europe/Copenhagen', country: '丹麦', countryCode: 'DK', flag: '🇩🇰', region: '欧洲' },
  { name: '赫尔辛基', timezone: 'Europe/Helsinki', country: '芬兰', countryCode: 'FI', flag: '🇫🇮', region: '欧洲' },
  { name: '华沙', timezone: 'Europe/Warsaw', country: '波兰', countryCode: 'PL', flag: '🇵🇱', region: '欧洲' },
  { name: '布拉格', timezone: 'Europe/Prague', country: '捷克', countryCode: 'CZ', flag: '🇨🇿', region: '欧洲' },
  { name: '布达佩斯', timezone: 'Europe/Budapest', country: '匈牙利', countryCode: 'HU', flag: '🇭🇺', region: '欧洲' },
  { name: '雅典', timezone: 'Europe/Athens', country: '希腊', countryCode: 'GR', flag: '🇬🇷', region: '欧洲' },
  
  // 美洲城市
  { name: '纽约', timezone: 'America/New_York', country: '美国', countryCode: 'US', flag: '🇺🇸', region: '美洲' },
  { name: '洛杉矶', timezone: 'America/Los_Angeles', country: '美国', countryCode: 'US', flag: '🇺🇸', region: '美洲' },
  { name: '芝加哥', timezone: 'America/Chicago', country: '美国', countryCode: 'US', flag: '🇺🇸', region: '美洲' },
  { name: '迈阿密', timezone: 'America/New_York', country: '美国', countryCode: 'US', flag: '🇺🇸', region: '美洲' },
  { name: '西雅图', timezone: 'America/Los_Angeles', country: '美国', countryCode: 'US', flag: '🇺🇸', region: '美洲' },
  { name: '多伦多', timezone: 'America/Toronto', country: '加拿大', countryCode: 'CA', flag: '🇨🇦', region: '美洲' },
  { name: '温哥华', timezone: 'America/Vancouver', country: '加拿大', countryCode: 'CA', flag: '🇨🇦', region: '美洲' },
  { name: '墨西哥城', timezone: 'America/Mexico_City', country: '墨西哥', countryCode: 'MX', flag: '🇲🇽', region: '美洲' },
  { name: '圣保罗', timezone: 'America/Sao_Paulo', country: '巴西', countryCode: 'BR', flag: '🇧🇷', region: '美洲' },
  { name: '里约热内卢', timezone: 'America/Sao_Paulo', country: '巴西', countryCode: 'BR', flag: '🇧🇷', region: '美洲' },
  { name: '布宜诺斯艾利斯', timezone: 'America/Argentina/Buenos_Aires', country: '阿根廷', countryCode: 'AR', flag: '🇦🇷', region: '美洲' },
  { name: '圣地亚哥', timezone: 'America/Santiago', country: '智利', countryCode: 'CL', flag: '🇨🇱', region: '美洲' },
  { name: '利马', timezone: 'America/Lima', country: '秘鲁', countryCode: 'PE', flag: '🇵🇪', region: '美洲' },
  { name: '波哥大', timezone: 'America/Bogota', country: '哥伦比亚', countryCode: 'CO', flag: '🇨🇴', region: '美洲' },
  { name: '加拉加斯', timezone: 'America/Caracas', country: '委内瑞拉', countryCode: 'VE', flag: '🇻🇪', region: '美洲' },
  
  // 大洋洲城市
  { name: '悉尼', timezone: 'Australia/Sydney', country: '澳大利亚', countryCode: 'AU', flag: '🇦🇺', region: '大洋洲' },
  { name: '墨尔本', timezone: 'Australia/Melbourne', country: '澳大利亚', countryCode: 'AU', flag: '🇦🇺', region: '大洋洲' },
  { name: '布里斯班', timezone: 'Australia/Brisbane', country: '澳大利亚', countryCode: 'AU', flag: '🇦🇺', region: '大洋洲' },
  { name: '珀斯', timezone: 'Australia/Perth', country: '澳大利亚', countryCode: 'AU', flag: '🇦🇺', region: '大洋洲' },
  { name: '奥克兰', timezone: 'Pacific/Auckland', country: '新西兰', countryCode: 'NZ', flag: '🇳🇿', region: '大洋洲' },
  { name: '惠灵顿', timezone: 'Pacific/Auckland', country: '新西兰', countryCode: 'NZ', flag: '🇳🇿', region: '大洋洲' },
  { name: '斐济', timezone: 'Pacific/Fiji', country: '斐济', countryCode: 'FJ', flag: '🇫🇯', region: '大洋洲' },
  { name: '塔希提', timezone: 'Pacific/Tahiti', country: '法属波利尼西亚', countryCode: 'PF', flag: '🇵🇫', region: '大洋洲' },
  
  // 非洲城市
  { name: '开罗', timezone: 'Africa/Cairo', country: '埃及', countryCode: 'EG', flag: '🇪🇬', region: '非洲' },
  { name: '约翰内斯堡', timezone: 'Africa/Johannesburg', country: '南非', countryCode: 'ZA', flag: '🇿🇦', region: '非洲' },
  { name: '开普敦', timezone: 'Africa/Johannesburg', country: '南非', countryCode: 'ZA', flag: '🇿🇦', region: '非洲' },
  { name: '拉各斯', timezone: 'Africa/Lagos', country: '尼日利亚', countryCode: 'NG', flag: '🇳🇬', region: '非洲' },
  { name: '内罗毕', timezone: 'Africa/Nairobi', country: '肯尼亚', countryCode: 'KE', flag: '🇰🇪', region: '非洲' },
  { name: '卡萨布兰卡', timezone: 'Africa/Casablanca', country: '摩洛哥', countryCode: 'MA', flag: '🇲🇦', region: '非洲' },
  { name: '突尼斯', timezone: 'Africa/Tunis', country: '突尼斯', countryCode: 'TN', flag: '🇹🇳', region: '非洲' },
  { name: '阿尔及尔', timezone: 'Africa/Algiers', country: '阿尔及利亚', countryCode: 'DZ', flag: '🇩🇿', region: '非洲' }
]

/**
 * 搜索城市云函数
 * @param {Object} event 事件参数
 * @param {string} event.keyword 搜索关键词
 * @param {string} event.region 地区筛选
 * @param {number} event.limit 结果数量限制
 * @returns {Object} 搜索结果
 */
exports.main = async (event, context) => {
  console.log('搜索城市请求:', event)
  
  try {
    const { keyword, region, limit = 20 } = event
    
    if (!keyword || keyword.trim() === '') {
      return {
        success: true,
        data: CITIES_DATABASE.slice(0, limit),
        total: CITIES_DATABASE.length,
        message: '返回所有城市'
      }
    }
    
    const searchKeyword = keyword.toLowerCase().trim()
    let results = CITIES_DATABASE
    
    // 按关键词搜索
    results = results.filter(city => {
      return city.name.toLowerCase().includes(searchKeyword) ||
             city.country.toLowerCase().includes(searchKeyword) ||
             city.timezone.toLowerCase().includes(searchKeyword) ||
             city.countryCode.toLowerCase().includes(searchKeyword)
    })
    
    // 按地区筛选
    if (region) {
      results = results.filter(city => city.region === region)
    }
    
    // 限制结果数量
    results = results.slice(0, limit)
    
    // 按相关性排序
    results = sortByRelevance(results, searchKeyword)
    
    return {
      success: true,
      data: results,
      total: results.length,
      keyword: keyword,
      region: region,
      message: `找到 ${results.length} 个相关城市`
    }
    
  } catch (error) {
    console.error('搜索城市失败:', error)
    return {
      success: false,
      error: error.message,
      message: '搜索失败'
    }
  }
}

/**
 * 按相关性排序
 * @param {Array} cities 城市列表
 * @param {string} keyword 关键词
 * @returns {Array} 排序后的城市列表
 */
function sortByRelevance(cities, keyword) {
  return cities.sort((a, b) => {
    const aScore = calculateRelevanceScore(a, keyword)
    const bScore = calculateRelevanceScore(b, keyword)
    return bScore - aScore
  })
}

/**
 * 计算相关性分数
 * @param {Object} city 城市对象
 * @param {string} keyword 关键词
 * @returns {number} 相关性分数
 */
function calculateRelevanceScore(city, keyword) {
  let score = 0
  
  // 城市名称完全匹配
  if (city.name.toLowerCase() === keyword) {
    score += 100
  }
  // 城市名称开头匹配
  else if (city.name.toLowerCase().startsWith(keyword)) {
    score += 80
  }
  // 城市名称包含
  else if (city.name.toLowerCase().includes(keyword)) {
    score += 60
  }
  
  // 国家名称完全匹配
  if (city.country.toLowerCase() === keyword) {
    score += 50
  }
  // 国家名称开头匹配
  else if (city.country.toLowerCase().startsWith(keyword)) {
    score += 40
  }
  // 国家名称包含
  else if (city.country.toLowerCase().includes(keyword)) {
    score += 30
  }
  
  // 时区匹配
  if (city.timezone.toLowerCase().includes(keyword)) {
    score += 20
  }
  
  // 国家代码匹配
  if (city.countryCode.toLowerCase() === keyword) {
    score += 15
  }
  
  return score
}
