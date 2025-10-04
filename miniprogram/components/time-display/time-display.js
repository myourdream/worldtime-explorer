// components/time-display/time-display.js
const TimezoneUtils = require('../../utils/timezone.js')
const Constants = require('../../utils/constants.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 时间对象
    time: {
      type: Date,
      value: new Date(),
      observer: function(newVal) {
        this.updateDisplay(newVal)
      }
    },
    // 时区
    timezone: {
      type: String,
      value: 'Asia/Shanghai',
      observer: function(newVal) {
        this.updateDisplay(this.data.time)
      }
    },
    // 显示格式
    format: {
      type: String,
      value: 'FULL',
      observer: function(newVal) {
        this.updateDisplay(this.data.time)
      }
    },
    // 是否显示秒
    showSeconds: {
      type: Boolean,
      value: true,
      observer: function(newVal) {
        this.updateDisplay(this.data.time)
      }
    },
    // 是否显示日期
    showDate: {
      type: Boolean,
      value: false,
      observer: function(newVal) {
        this.updateDisplay(this.data.time)
      }
    },
    // 是否显示时区
    showTimezone: {
      type: Boolean,
      value: false,
      observer: function(newVal) {
        this.updateDisplay(this.data.time)
      }
    },
    // 尺寸大小
    size: {
      type: String,
      value: 'normal' // small, normal, large
    },
    // 主题
    theme: {
      type: String,
      value: 'gradient' // dark, light, gradient
    },
    // 是否正在加载
    isLoading: {
      type: Boolean,
      value: false
    },
    // 是否有错误
    hasError: {
      type: Boolean,
      value: false
    },
    // 错误消息
    errorMessage: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hours: '00',
    minutes: '00',
    seconds: '00',
    period: '',
    showPeriod: false,
    formattedDate: '',
    timezoneName: ''
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      console.log('TimeDisplay组件已加载')
      this.initComponent()
    },

    detached() {
      console.log('TimeDisplay组件已卸载')
      this.clearTimers()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化组件
     */
    initComponent() {
      this.updateDisplay(this.data.time)
      this.startTimeUpdate()
    },

    /**
     * 更新显示
     */
    updateDisplay(time) {
      if (!time || !this.data.timezone) return

      try {
        const localTime = TimezoneUtils.getCurrentTime(this.data.timezone)
        this.updateTimeParts(localTime)
        
        if (this.data.showDate) {
          this.updateDate(localTime)
        }
        
        if (this.data.showTimezone) {
          this.updateTimezone()
        }

        // 清除错误状态
        this.setData({ 
          hasError: false,
          errorMessage: ''
        })

      } catch (error) {
        console.error('更新显示失败:', error)
        this.setData({ 
          hasError: true,
          errorMessage: '时间显示错误'
        })
      }
    },

    /**
     * 更新时间部分
     */
    updateTimeParts(time) {
      try {
        // 直接使用备用方法，确保格式一致
        this.updateTimePartsFallback(time)
      } catch (error) {
        console.error('更新时间部分失败:', error)
        // 使用备用方法
        this.updateTimePartsFallback(time)
      }
    },

    /**
     * 备用时间更新方法
     */
    updateTimePartsFallback(time) {
      try {
        const hours = time.getHours().toString().padStart(2, '0')
        const minutes = time.getMinutes().toString().padStart(2, '0')
        const seconds = time.getSeconds().toString().padStart(2, '0')
        
        this.setData({
          hours,
          minutes,
          seconds,
          period: '',
          showPeriod: false
        })
      } catch (error) {
        console.error('备用时间更新失败:', error)
        this.setData({
          hours: '--',
          minutes: '--',
          seconds: '--',
          period: '',
          showPeriod: false
        })
      }
    },

    /**
     * 更新日期
     */
    updateDate(time) {
      try {
        // 使用数字格式确保一致性
        const year = time.getFullYear()
        const month = (time.getMonth() + 1).toString().padStart(2, '0')
        const day = time.getDate().toString().padStart(2, '0')
        
        this.setData({ 
          formattedDate: `${year}/${month}/${day}`
        })
      } catch (error) {
        console.error('更新日期失败:', error)
        this.setData({ formattedDate: '日期错误' })
      }
    },

    /**
     * 更新时区信息
     */
    updateTimezone() {
      try {
        const timezoneInfo = TimezoneUtils.getTimezoneInfo(this.data.timezone)
        const timezoneName = timezoneInfo ? timezoneInfo.name : this.data.timezone
        
        this.setData({ timezoneName })
      } catch (error) {
        console.error('更新时区信息失败:', error)
        this.setData({ timezoneName: this.data.timezone })
      }
    },

    /**
     * 启动时间更新
     */
    startTimeUpdate() {
      // 每秒更新一次
      this.timeUpdateTimer = setInterval(() => {
        this.updateDisplay(this.data.time)
      }, 1000)
    },

    /**
     * 清除定时器
     */
    clearTimers() {
      if (this.timeUpdateTimer) {
        clearInterval(this.timeUpdateTimer)
        this.timeUpdateTimer = null
      }
    },

    /**
     * 设置时间
     */
    setTime(time) {
      this.setData({ time })
      this.updateDisplay(time)
    },

    /**
     * 设置时区
     */
    setTimezone(timezone) {
      this.setData({ timezone })
      this.updateDisplay(this.data.time)
    },

    /**
     * 设置格式
     */
    setFormat(format) {
      this.setData({ format })
      this.updateDisplay(this.data.time)
    },

    /**
     * 获取当前显示的时间
     */
    getDisplayTime() {
      return {
        hours: this.data.hours,
        minutes: this.data.minutes,
        seconds: this.data.seconds,
        period: this.data.period,
        formattedDate: this.data.formattedDate,
        timezoneName: this.data.timezoneName
      }
    },

    /**
     * 刷新显示
     */
    refresh() {
      this.updateDisplay(this.data.time)
    }
  },

  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show() {
      // 页面显示时更新时间
      this.updateDisplay(this.data.time)
    },

    hide() {
      // 页面隐藏时清除定时器
      this.clearTimers()
    }
  }
})
