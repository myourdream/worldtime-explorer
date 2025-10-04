// components/city-card/city-card.js
const TimezoneUtils = require('../../utils/timezone.js')
const Constants = require('../../utils/constants.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 城市数据
    cityData: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {
        if (newVal && newVal.timezone) {
          this.updateTime()
        }
      }
    },
    // 当前时间
    currentTime: {
      type: Date,
      value: new Date(),
      observer: function(newVal) {
        this.updateDisplayTime(newVal)
      }
    },
    // 是否显示移除按钮
    showRemove: {
      type: Boolean,
      value: false
    },
    // 时间格式
    timeFormat: {
      type: String,
      value: 'FULL'
    },
    // 是否显示秒
    showSeconds: {
      type: Boolean,
      value: true
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
    isFavorite: false,
    isSelected: false,
    formattedDate: '',
    dayOfWeek: '',
    timezoneOffset: '',
    displayTime: null
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      console.log('CityCard组件已加载')
      this.initComponent()
    },

    detached() {
      console.log('CityCard组件已卸载')
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
      this.checkFavoriteStatus()
      this.updateTime()
      this.startTimeUpdate()
    },

    /**
     * 检查收藏状态
     */
    checkFavoriteStatus() {
      try {
        const favoriteCities = wx.getStorageSync(Constants.STORAGE_KEYS.FAVORITE_CITIES) || []
        const isFavorite = favoriteCities.some(city => 
          city.timezone === this.data.cityData.timezone
        )
        this.setData({ isFavorite })
      } catch (error) {
        console.error('检查收藏状态失败:', error)
      }
    },

    /**
     * 更新时间
     */
    updateTime() {
      if (!this.data.cityData.timezone) return

      try {
        const currentTime = TimezoneUtils.getCurrentTime(this.data.cityData.timezone)
        this.updateDisplayTime(currentTime)
        this.updateDateInfo(currentTime)
        this.updateTimezoneInfo()
      } catch (error) {
        console.error('更新时间失败:', error)
        this.setData({ hasError: true, errorMessage: '时间获取失败' })
      }
    },

    /**
     * 更新显示时间
     */
    updateDisplayTime(time) {
      if (!time || !this.data.cityData.timezone) return

      try {
        // 使用TimezoneUtils的formatTime方法，现在返回一致的数字格式
        const formattedTime = TimezoneUtils.formatTime(time, this.data.cityData.timezone, Constants.TIME_FORMATS.FULL)
        
        this.setData({ 
          displayTime: formattedTime,
          hasError: false,
          errorMessage: ''
        })
      } catch (error) {
        console.error('更新显示时间失败:', error)
        this.setData({ hasError: true, errorMessage: '时间格式化失败' })
      }
    },

    /**
     * 更新日期信息
     */
    updateDateInfo(time) {
      if (!time || !this.data.cityData.timezone) return

      try {
        // 使用TimezoneUtils的formatTime方法，现在返回一致的数字格式
        const formattedDate = TimezoneUtils.formatTime(time, this.data.cityData.timezone, Constants.TIME_FORMATS.DATE_ONLY)
        
        const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const dayOfWeek = dayNames[time.getDay()]
        
        this.setData({ 
          formattedDate,
          dayOfWeek
        })
      } catch (error) {
        console.error('更新日期信息失败:', error)
      }
    },

    /**
     * 更新时区信息
     */
    updateTimezoneInfo() {
      if (!this.data.cityData.timezone) return

      try {
        const offset = TimezoneUtils.getTimezoneOffset(this.data.cityData.timezone)
        const offsetStr = offset >= 0 ? `+${offset.toFixed(1)}` : `${offset.toFixed(1)}`
        
        this.setData({ timezoneOffset: `UTC${offsetStr}` })
      } catch (error) {
        console.error('更新时区信息失败:', error)
      }
    },

    /**
     * 启动时间更新
     */
    startTimeUpdate() {
      // 每秒更新一次时间
      this.timeUpdateTimer = setInterval(() => {
        this.updateTime()
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
     * 切换收藏状态
     */
    toggleFavorite() {
      try {
        const favoriteCities = wx.getStorageSync(Constants.STORAGE_KEYS.FAVORITE_CITIES) || []
        const cityIndex = favoriteCities.findIndex(city => 
          city.timezone === this.data.cityData.timezone
        )

        let newFavoriteCities
        let isFavorite

        if (cityIndex >= 0) {
          // 取消收藏
          newFavoriteCities = favoriteCities.filter((_, index) => index !== cityIndex)
          isFavorite = false
          wx.showToast({
            title: Constants.SUCCESS_MESSAGES.CITY_UNFAVORITED,
            icon: 'success'
          })
        } else {
          // 添加收藏
          newFavoriteCities = [...favoriteCities, this.data.cityData]
          isFavorite = true
          wx.showToast({
            title: Constants.SUCCESS_MESSAGES.CITY_FAVORITED,
            icon: 'success'
          })
        }

        wx.setStorageSync(Constants.STORAGE_KEYS.FAVORITE_CITIES, newFavoriteCities)
        this.setData({ isFavorite })

        // 触发收藏状态变化事件
        this.triggerEvent('favoriteChange', {
          city: this.data.cityData,
          isFavorite: isFavorite
        })

      } catch (error) {
        console.error('切换收藏状态失败:', error)
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },

    /**
     * 移除城市
     */
    removeCity() {
      wx.showModal({
        title: '确认移除',
        content: `确定要移除 ${this.data.cityData.name} 吗？`,
        success: (res) => {
          if (res.confirm) {
            this.triggerEvent('removeCity', {
              city: this.data.cityData
            })
          }
        }
      })
    },

    /**
     * 长按事件
     */
    onLongPress() {
      wx.vibrateShort()
      this.toggleFavorite()
    },

    /**
     * 点击事件
     */
    onTap() {
      this.triggerEvent('cityTap', {
        city: this.data.cityData
      })
    },

    /**
     * 重试加载
     */
    retryLoad() {
      this.setData({ 
        isLoading: true,
        hasError: false,
        errorMessage: ''
      })
      
      // 延迟一下再重试，给用户反馈
      setTimeout(() => {
        this.updateTime()
        this.setData({ isLoading: false })
      }, 1000)
    },

    /**
     * 设置选中状态
     */
    setSelected(selected) {
      this.setData({ isSelected: selected })
    },

    /**
     * 获取城市信息
     */
    getCityInfo() {
      return {
        ...this.data.cityData,
        isFavorite: this.data.isFavorite,
        isSelected: this.data.isSelected,
        currentTime: this.data.displayTime,
        timezoneOffset: this.data.timezoneOffset
      }
    }
  },

  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show() {
      // 页面显示时更新时间
      this.updateTime()
    },

    hide() {
      // 页面隐藏时清除定时器
      this.clearTimers()
    }
  }
})
