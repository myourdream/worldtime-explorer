// pages/index/index.js
const TimezoneUtils = require('../../utils/timezone.js')
const Constants = require('../../utils/constants.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTime: new Date(),
    localTimezone: 'Asia/Shanghai',
    cities: [],
    isLoading: true,
    hasError: false,
    errorMessage: '',
    refreshTimer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('首页加载')
    this.initPage()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('首页渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('首页显示')
    this.startTimeUpdate()
    this.loadCities()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('首页隐藏')
    this.clearTimers()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('首页卸载')
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('上拉触底')
    // 可以在这里加载更多城市
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '世界时间查看器',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    }
  },

  /**
   * 初始化页面
   */
  initPage() {
    this.getLocalTimezone()
    this.loadUserPreferences()
    this.loadCities()
  },

  /**
   * 获取本地时区
   */
  getLocalTimezone() {
    try {
      // 尝试获取用户位置
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          console.log('获取位置成功:', res)
          // 这里可以根据经纬度确定时区，简化处理使用默认值
          this.setData({ localTimezone: 'Asia/Shanghai' })
        },
        fail: (error) => {
          console.log('获取位置失败:', error)
          this.setData({ localTimezone: 'Asia/Shanghai' })
        }
      })
    } catch (error) {
      console.error('获取本地时区失败:', error)
      this.setData({ localTimezone: 'Asia/Shanghai' })
    }
  },

  /**
   * 加载用户偏好设置
   */
  loadUserPreferences() {
    try {
      const preferences = wx.getStorageSync(Constants.STORAGE_KEYS.USER_PREFERENCES) || Constants.USER_PREFERENCES
      this.setData({ 
        localTimezone: preferences.DEFAULT_TIMEZONE,
        showSeconds: preferences.SHOW_SECONDS,
        autoRefresh: preferences.AUTO_REFRESH,
        refreshInterval: preferences.REFRESH_INTERVAL
      })
    } catch (error) {
      console.error('加载用户偏好失败:', error)
    }
  },

  /**
   * 加载城市列表
   */
  loadCities() {
    this.setData({ isLoading: true, hasError: false })

    try {
      // 先尝试从本地存储加载
      const savedCities = wx.getStorageSync(Constants.STORAGE_KEYS.SELECTED_CITIES)
      
      if (savedCities && savedCities.length > 0) {
        this.setData({ 
          cities: savedCities,
          isLoading: false
        })
        console.log('从本地存储加载城市:', savedCities.length)
      } else {
        // 使用默认城市列表
        const defaultCities = Constants.DEFAULT_CITIES
        this.setData({ 
          cities: defaultCities,
          isLoading: false
        })
        console.log('使用默认城市列表:', defaultCities.length)
        
        // 保存默认城市到本地存储
        wx.setStorageSync(Constants.STORAGE_KEYS.SELECTED_CITIES, defaultCities)
      }

      // 更新所有城市的时间
      this.updateAllCitiesTime()

    } catch (error) {
      console.error('加载城市列表失败:', error)
      this.setData({ 
        isLoading: false,
        hasError: true,
        errorMessage: Constants.ERROR_MESSAGES.NETWORK_ERROR
      })
    }
  },

  /**
   * 更新所有城市时间
   */
  updateAllCitiesTime() {
    this.setData({ currentTime: new Date() })
  },

  /**
   * 启动时间更新
   */
  startTimeUpdate() {
    // 立即更新一次
    this.updateAllCitiesTime()
    
    // 每秒更新一次
    this.data.refreshTimer = setInterval(() => {
      this.updateAllCitiesTime()
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
   * 刷新数据
   */
  refreshData() {
    console.log('刷新数据')
    this.setData({ isLoading: true })
    
    // 模拟网络请求延迟
    setTimeout(() => {
      this.loadCities()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500
      })
    }, 1000)
  },

  /**
   * 重试加载
   */
  retryLoad() {
    this.loadCities()
  },

  /**
   * 城市收藏状态变化
   */
  onFavoriteChange(e) {
    const { city, isFavorite } = e.detail
    console.log('城市收藏状态变化:', city.name, isFavorite)
    
    // 更新本地存储的收藏列表
    try {
      const favoriteCities = wx.getStorageSync(Constants.STORAGE_KEYS.FAVORITE_CITIES) || []
      let newFavoriteCities
      
      if (isFavorite) {
        newFavoriteCities = [...favoriteCities, city]
      } else {
        newFavoriteCities = favoriteCities.filter(c => c.timezone !== city.timezone)
      }
      
      wx.setStorageSync(Constants.STORAGE_KEYS.FAVORITE_CITIES, newFavoriteCities)
    } catch (error) {
      console.error('更新收藏列表失败:', error)
    }
  },

  /**
   * 城市点击事件
   */
  onCityTap(e) {
    const { city } = e.detail
    console.log('点击城市:', city.name)
    
    // 可以跳转到城市详情页面
    wx.showModal({
      title: city.name,
      content: `时区: ${city.timezone}\n国家: ${city.country}`,
      showCancel: false
    })
  },

  /**
   * 跳转到搜索页面
   */
  goToSearch() {
    wx.navigateTo({
      url: '/pages/city-search/city-search'
    })
  },

  /**
   * 跳转到转换页面
   */
  goToConverter() {
    wx.navigateTo({
      url: '/pages/time-converter/time-converter'
    })
  },

  /**
   * 显示设置
   */
  showSettings() {
    wx.showActionSheet({
      itemList: ['添加城市', '管理收藏', '时区设置', '关于应用'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.goToSearch()
            break
          case 1:
            this.showFavoriteCities()
            break
          case 2:
            this.showTimezoneSettings()
            break
          case 3:
            this.showAbout()
            break
        }
      }
    })
  },

  /**
   * 显示收藏城市
   */
  showFavoriteCities() {
    try {
      const favoriteCities = wx.getStorageSync(Constants.STORAGE_KEYS.FAVORITE_CITIES) || []
      
      if (favoriteCities.length === 0) {
        wx.showToast({
          title: '暂无收藏城市',
          icon: 'none'
        })
        return
      }

      const cityNames = favoriteCities.map(city => city.name)
      
      wx.showActionSheet({
        itemList: cityNames,
        success: (res) => {
          const selectedCity = favoriteCities[res.tapIndex]
          wx.showModal({
            title: selectedCity.name,
            content: `时区: ${selectedCity.timezone}\n国家: ${selectedCity.country}`,
            showCancel: false
          })
        }
      })
    } catch (error) {
      console.error('显示收藏城市失败:', error)
    }
  },

  /**
   * 显示时区设置
   */
  showTimezoneSettings() {
    wx.showModal({
      title: '时区设置',
      content: '当前本地时区: ' + this.data.localTimezone,
      showCancel: false
    })
  },

  /**
   * 显示关于信息
   */
  showAbout() {
    wx.showModal({
      title: '关于应用',
      content: `${Constants.APP_NAME}\n版本: ${Constants.APP_VERSION}\n\n${Constants.APP_DESCRIPTION}`,
      showCancel: false
    })
  },

  /**
   * 时间更新回调（由app.js调用）
   */
  onTimeUpdate(time) {
    this.setData({ currentTime: time })
  }
})
