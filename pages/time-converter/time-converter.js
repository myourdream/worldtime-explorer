// pages/time-converter/time-converter.js
const TimezoneUtils = require('../../utils/timezone.js')
const Constants = require('../../utils/constants.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    sourceTimezone: {},
    targetTimezone: {},
    sourceTime: new Date(),
    convertedTime: null,
    timeDifference: null,
    quickTimezones: [],
    customDate: '',
    customTime: '',
    conversionHistory: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('时区转换页面加载')
    this.initPage()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('时区转换页面渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('时区转换页面显示')
    this.loadConversionHistory()
    this.startTimeUpdate()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('时区转换页面隐藏')
    this.clearTimers()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('时区转换页面卸载')
    this.clearTimers()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.refreshData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '时区转换工具',
      path: '/pages/time-converter/time-converter'
    }
  },

  /**
   * 初始化页面
   */
  initPage() {
    this.loadQuickTimezones()
    this.initCustomTime()
    this.loadConversionHistory()
  },

  /**
   * 加载快捷时区
   */
  loadQuickTimezones() {
    const quickTimezones = [
      { name: '北京', timezone: 'Asia/Shanghai', country: '中国', flag: '🇨🇳' },
      { name: '纽约', timezone: 'America/New_York', country: '美国', flag: '🇺🇸' },
      { name: '伦敦', timezone: 'Europe/London', country: '英国', flag: '🇬🇧' },
      { name: '东京', timezone: 'Asia/Tokyo', country: '日本', flag: '🇯🇵' },
      { name: '悉尼', timezone: 'Australia/Sydney', country: '澳大利亚', flag: '🇦🇺' },
      { name: '巴黎', timezone: 'Europe/Paris', country: '法国', flag: '🇫🇷' },
      { name: '柏林', timezone: 'Europe/Berlin', country: '德国', flag: '🇩🇪' },
      { name: '莫斯科', timezone: 'Europe/Moscow', country: '俄罗斯', flag: '🇷🇺' }
    ]
    
    this.setData({ quickTimezones })
  },

  /**
   * 初始化自定义时间
   */
  initCustomTime() {
    const now = new Date()
    const date = now.toISOString().split('T')[0]
    const time = now.toTimeString().split(' ')[0].substring(0, 5)
    
    this.setData({ 
      customDate: date,
      customTime: time
    })
  },

  /**
   * 启动时间更新
   */
  startTimeUpdate() {
    this.data.refreshTimer = setInterval(() => {
      this.setData({ sourceTime: new Date() })
      
      // 如果有转换结果，也更新时间
      if (this.data.convertedTime && this.data.sourceTimezone.timezone && this.data.targetTimezone.timezone) {
        this.performConversion()
      }
    }, 1000)
  },

  /**
   * 清除定时器
   */
  clearTimers() {
    if (this.data.refreshTimer) {
      clearInterval(this.data.refreshTimer)
      this.data.refreshTimer = null
    }
  },

  /**
   * 选择源时区
   */
  selectSourceTimezone() {
    this.showTimezonePicker('source')
  },

  /**
   * 选择目标时区
   */
  selectTargetTimezone() {
    this.showTimezonePicker('target')
  },

  /**
   * 显示时区选择器
   */
  showTimezonePicker(type) {
    const timezones = TimezoneUtils.getSupportedTimezones()
    const timezoneNames = timezones.map(tz => `${tz.name} (${tz.country})`)
    
    wx.showActionSheet({
      itemList: timezoneNames,
      success: (res) => {
        const selectedTimezone = timezones[res.tapIndex]
        
        if (type === 'source') {
          this.setData({ 
            sourceTimezone: selectedTimezone,
            convertedTime: null,
            timeDifference: null
          })
        } else {
          this.setData({ 
            targetTimezone: selectedTimezone,
            convertedTime: null,
            timeDifference: null
          })
        }
        
        // 如果两个时区都已选择，自动执行转换
        if (this.data.sourceTimezone.timezone && this.data.targetTimezone.timezone) {
          this.performConversion()
        }
      }
    })
  },

  /**
   * 执行时区转换
   */
  performConversion() {
    if (!this.data.sourceTimezone.timezone || !this.data.targetTimezone.timezone) {
      wx.showToast({
        title: '请选择源时区和目标时区',
        icon: 'none'
      })
      return
    }

    try {
      const sourceTime = this.data.sourceTime
      const convertedTime = TimezoneUtils.convertTimezone(
        sourceTime,
        this.data.sourceTimezone.timezone,
        this.data.targetTimezone.timezone
      )
      
      const timeDifference = TimezoneUtils.getTimeDifference(
        this.data.sourceTimezone.timezone,
        this.data.targetTimezone.timezone
      )
      
      const differenceText = timeDifference >= 0 ? 
        `+${timeDifference.toFixed(1)}小时` : 
        `${timeDifference.toFixed(1)}小时`
      
      this.setData({ 
        convertedTime,
        timeDifference: differenceText
      })
      
      // 保存到转换历史
      this.saveConversionHistory()
      
    } catch (error) {
      console.error('时区转换失败:', error)
      wx.showToast({
        title: Constants.ERROR_MESSAGES.CONVERSION_ERROR,
        icon: 'none'
      })
    }
  },

  /**
   * 选择快捷时区
   */
  selectQuickTimezone(e) {
    const timezone = e.currentTarget.dataset.timezone
    
    wx.showActionSheet({
      itemList: ['设为源时区', '设为目标时区'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.setData({ 
            sourceTimezone: timezone,
            convertedTime: null,
            timeDifference: null
          })
        } else {
          this.setData({ 
            targetTimezone: timezone,
            convertedTime: null,
            timeDifference: null
          })
        }
        
        // 如果两个时区都已选择，自动执行转换
        if (this.data.sourceTimezone.timezone && this.data.targetTimezone.timezone) {
          this.performConversion()
        }
      }
    })
  },

  /**
   * 日期变化事件
   */
  onDateChange(e) {
    this.setData({ customDate: e.detail.value })
  },

  /**
   * 时间变化事件
   */
  onTimeChange(e) {
    this.setData({ customTime: e.detail.value })
  },

  /**
   * 应用自定义时间
   */
  applyCustomTime() {
    try {
      const dateTimeString = `${this.data.customDate}T${this.data.customTime}:00`
      const customTime = new Date(dateTimeString)
      
      if (isNaN(customTime.getTime())) {
        wx.showToast({
          title: '时间格式错误',
          icon: 'none'
        })
        return
      }
      
      this.setData({ sourceTime: customTime })
      
      // 如果两个时区都已选择，自动执行转换
      if (this.data.sourceTimezone.timezone && this.data.targetTimezone.timezone) {
        this.performConversion()
      }
      
      wx.showToast({
        title: '时间已应用',
        icon: 'success'
      })
      
    } catch (error) {
      console.error('应用自定义时间失败:', error)
      wx.showToast({
        title: '时间格式错误',
        icon: 'none'
      })
    }
  },

  /**
   * 保存转换历史
   */
  saveConversionHistory() {
    try {
      const historyItem = {
        source: this.data.sourceTimezone,
        target: this.data.targetTimezone,
        time: TimezoneUtils.formatTime(this.data.sourceTime, this.data.sourceTimezone.timezone, Constants.TIME_FORMATS.FULL),
        timestamp: Date.now()
      }
      
      let history = wx.getStorageSync('conversion_history') || []
      history.unshift(historyItem)
      
      // 限制历史记录数量
      history = history.slice(0, 20)
      
      wx.setStorageSync('conversion_history', history)
      this.setData({ conversionHistory: history })
      
    } catch (error) {
      console.error('保存转换历史失败:', error)
    }
  },

  /**
   * 加载转换历史
   */
  loadConversionHistory() {
    try {
      const history = wx.getStorageSync('conversion_history') || []
      this.setData({ conversionHistory: history })
    } catch (error) {
      console.error('加载转换历史失败:', error)
    }
  },

  /**
   * 使用历史记录项
   */
  useHistoryItem(e) {
    const item = e.currentTarget.dataset.item
    
    this.setData({
      sourceTimezone: item.source,
      targetTimezone: item.target,
      sourceTime: new Date(item.timestamp)
    })
    
    // 执行转换
    this.performConversion()
  },

  /**
   * 清空历史记录
   */
  clearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有转换历史吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('conversion_history')
            this.setData({ conversionHistory: [] })
            wx.showToast({
              title: '已清空',
              icon: 'success'
            })
          } catch (error) {
            console.error('清空历史记录失败:', error)
          }
        }
      }
    })
  },

  /**
   * 刷新数据
   */
  refreshData() {
    this.loadQuickTimezones()
    this.initCustomTime()
    this.loadConversionHistory()
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    })
  }
})
