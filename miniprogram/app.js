// app.js
App({
  globalData: {
    userInfo: null,
    currentTime: null,
    selectedCities: [
      { name: '北京', timezone: 'Asia/Shanghai', country: '中国' },
      { name: '纽约', timezone: 'America/New_York', country: '美国' },
      { name: '伦敦', timezone: 'Europe/London', country: '英国' },
      { name: '东京', timezone: 'Asia/Tokyo', country: '日本' },
      { name: '悉尼', timezone: 'Australia/Sydney', country: '澳大利亚' },
      { name: '巴黎', timezone: 'Europe/Paris', country: '法国' }
    ],
    timeUpdateInterval: null
  },

  onLaunch() {
    console.log('世界时间查看器启动')
    this.initApp()
  },

  onShow() {
    console.log('应用显示')
  },

  onHide() {
    console.log('应用隐藏')
    // 清除定时器以节省资源
    if (this.globalData.timeUpdateInterval) {
      clearInterval(this.globalData.timeUpdateInterval)
    }
  },

  onError(error) {
    console.error('应用错误:', error)
    wx.showToast({
      title: '应用出现错误',
      icon: 'none',
      duration: 2000
    })
  },

  /**
   * 初始化应用
   */
  initApp() {
    // 检查云开发环境
    if (wx.cloud) {
      wx.cloud.init({
        env: 'worldtime-explorer', // 云开发环境ID
        traceUser: true
      })
      console.log('云开发初始化成功')
    }

    // 获取系统信息
    this.getSystemInfo()
    
    // 启动时间更新
    this.startTimeUpdate()
  },

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        console.log('系统信息:', res)
      },
      fail: (error) => {
        console.error('获取系统信息失败:', error)
      }
    })
  },

  /**
   * 启动时间更新
   */
  startTimeUpdate() {
    // 立即更新一次
    this.updateCurrentTime()
    
    // 每秒更新一次
    this.globalData.timeUpdateInterval = setInterval(() => {
      this.updateCurrentTime()
    }, 1000)
  },

  /**
   * 更新当前时间
   */
  updateCurrentTime() {
    this.globalData.currentTime = new Date()
    
    // 通知所有页面时间已更新
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page.onTimeUpdate && typeof page.onTimeUpdate === 'function') {
        page.onTimeUpdate(this.globalData.currentTime)
      }
    })
  },

  /**
   * 格式化时间
   * @param {Date} date 时间对象
   * @param {string} timezone 时区
   * @returns {string} 格式化后的时间字符串
   */
  formatTime(date, timezone = 'Asia/Shanghai') {
    try {
      return date.toLocaleString('zh-CN', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    } catch (error) {
      console.error('时间格式化错误:', error)
      return '时间格式错误'
    }
  },

  /**
   * 获取时区偏移
   * @param {string} timezone 时区
   * @returns {number} 时区偏移（小时）
   */
  getTimezoneOffset(timezone) {
    try {
      const now = new Date()
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000))
      const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }))
      return (targetTime.getTime() - utc.getTime()) / (1000 * 60 * 60)
    } catch (error) {
      console.error('获取时区偏移错误:', error)
      return 0
    }
  },

  /**
   * 显示加载提示
   * @param {string} title 提示文字
   */
  showLoading(title = '加载中...') {
    wx.showLoading({
      title: title,
      mask: true
    })
  },

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    wx.hideLoading()
  },

  /**
   * 显示错误提示
   * @param {string} message 错误信息
   */
  showError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    })
  },

  /**
   * 显示成功提示
   * @param {string} message 成功信息
   */
  showSuccess(message) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 1500
    })
  }
})
