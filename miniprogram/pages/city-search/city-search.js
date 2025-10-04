// pages/city-search/city-search.js
const TimezoneUtils = require('../../utils/timezone.js')
const Constants = require('../../utils/constants.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchKeyword: '',
    searchResults: [],
    searchHistory: [],
    popularCities: [],
    timezoneGroups: [],
    selectedCities: [],
    isSearching: false,
    hasError: false,
    errorMessage: '',
    currentTime: new Date(),
    searchTips: '输入城市名称或国家名称进行搜索'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('城市搜索页面加载')
    this.initPage()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('城市搜索页面渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('城市搜索页面显示')
    this.loadSearchHistory()
    this.loadPopularCities()
    this.loadTimezoneGroups()
    this.startTimeUpdate()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('城市搜索页面隐藏')
    this.clearTimers()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('城市搜索页面卸载')
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
      title: '搜索世界城市时间',
      path: '/pages/city-search/city-search'
    }
  },

  /**
   * 初始化页面
   */
  initPage() {
    this.loadSearchHistory()
    this.loadPopularCities()
    this.loadTimezoneGroups()
  },

  /**
   * 加载搜索历史
   */
  loadSearchHistory() {
    try {
      const history = wx.getStorageSync(Constants.STORAGE_KEYS.SEARCH_HISTORY) || []
      this.setData({ searchHistory: history.slice(0, 10) }) // 最多显示10条
    } catch (error) {
      console.error('加载搜索历史失败:', error)
    }
  },

  /**
   * 保存搜索历史
   */
  saveSearchHistory(keyword) {
    if (!keyword || keyword.trim() === '') return

    try {
      let history = wx.getStorageSync(Constants.STORAGE_KEYS.SEARCH_HISTORY) || []
      
      // 移除重复项
      history = history.filter(item => item !== keyword)
      
      // 添加到开头
      history.unshift(keyword)
      
      // 限制历史记录数量
      history = history.slice(0, 20)
      
      wx.setStorageSync(Constants.STORAGE_KEYS.SEARCH_HISTORY, history)
      this.setData({ searchHistory: history.slice(0, 10) })
    } catch (error) {
      console.error('保存搜索历史失败:', error)
    }
  },

  /**
   * 加载热门城市
   */
  loadPopularCities() {
    const popularCities = [
      { name: '北京', timezone: 'Asia/Shanghai', country: '中国', flag: '🇨🇳' },
      { name: '纽约', timezone: 'America/New_York', country: '美国', flag: '🇺🇸' },
      { name: '伦敦', timezone: 'Europe/London', country: '英国', flag: '🇬🇧' },
      { name: '东京', timezone: 'Asia/Tokyo', country: '日本', flag: '🇯🇵' },
      { name: '悉尼', timezone: 'Australia/Sydney', country: '澳大利亚', flag: '🇦🇺' },
      { name: '巴黎', timezone: 'Europe/Paris', country: '法国', flag: '🇫🇷' },
      { name: '柏林', timezone: 'Europe/Berlin', country: '德国', flag: '🇩🇪' },
      { name: '莫斯科', timezone: 'Europe/Moscow', country: '俄罗斯', flag: '🇷🇺' },
      { name: '迪拜', timezone: 'Asia/Dubai', country: '阿联酋', flag: '🇦🇪' },
      { name: '新加坡', timezone: 'Asia/Singapore', country: '新加坡', flag: '🇸🇬' },
      { name: '首尔', timezone: 'Asia/Seoul', country: '韩国', flag: '🇰🇷' },
      { name: '曼谷', timezone: 'Asia/Bangkok', country: '泰国', flag: '🇹🇭' }
    ]
    
    this.setData({ popularCities })
  },

  /**
   * 加载时区分组
   */
  loadTimezoneGroups() {
    const groups = Object.keys(Constants.TIMEZONE_GROUPS).map(key => {
      const group = Constants.TIMEZONE_GROUPS[key]
      return {
        name: group.name,
        timezones: group.timezones.map(tz => {
          const timezoneInfo = TimezoneUtils.getTimezoneInfo(tz)
          return timezoneInfo || { name: tz, timezone: tz, country: '', offset: '' }
        })
      }
    })
    
    this.setData({ timezoneGroups: groups })
  },

  /**
   * 启动时间更新
   */
  startTimeUpdate() {
    this.data.refreshTimer = setInterval(() => {
      this.setData({ currentTime: new Date() })
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
   * 搜索输入事件
   */
  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    
    // 防抖搜索
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }
    
    this.searchTimer = setTimeout(() => {
      if (keyword.trim()) {
        this.performSearch(keyword.trim())
      } else {
        this.setData({ searchResults: [] })
      }
    }, 300)
  },

  /**
   * 搜索确认事件
   */
  onSearchConfirm() {
    const keyword = this.data.searchKeyword.trim()
    if (keyword) {
      this.performSearch(keyword)
      this.saveSearchHistory(keyword)
    }
  },

  /**
   * 执行搜索
   */
  performSearch(keyword) {
    console.log('搜索关键词:', keyword)
    
    this.setData({ 
      isSearching: true,
      hasError: false,
      errorMessage: ''
    })

    try {
      // 使用本地搜索
      const results = TimezoneUtils.searchTimezones(keyword)
      
      // 模拟网络延迟
      setTimeout(() => {
        this.setData({ 
          searchResults: results,
          isSearching: false
        })
        
        if (results.length === 0) {
          this.setData({ 
            searchTips: '未找到相关城市，请尝试其他关键词'
          })
        } else {
          this.setData({ 
            searchTips: `找到 ${results.length} 个相关城市`
          })
        }
      }, 500)

    } catch (error) {
      console.error('搜索失败:', error)
      this.setData({ 
        isSearching: false,
        hasError: true,
        errorMessage: Constants.ERROR_MESSAGES.SEARCH_ERROR
      })
    }
  },

  /**
   * 选择历史记录项
   */
  selectHistoryItem(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ searchKeyword: keyword })
    this.performSearch(keyword)
  },

  /**
   * 删除历史记录项
   */
  deleteHistoryItem(e) {
    const index = e.currentTarget.dataset.index
    try {
      let history = wx.getStorageSync(Constants.STORAGE_KEYS.SEARCH_HISTORY) || []
      history.splice(index, 1)
      wx.setStorageSync(Constants.STORAGE_KEYS.SEARCH_HISTORY, history)
      this.setData({ searchHistory: history.slice(0, 10) })
    } catch (error) {
      console.error('删除历史记录失败:', error)
    }
  },

  /**
   * 清空搜索历史
   */
  clearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync(Constants.STORAGE_KEYS.SEARCH_HISTORY)
            this.setData({ searchHistory: [] })
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
   * 选择城市
   */
  selectCity(e) {
    const city = e.currentTarget.dataset.city
    console.log('选择城市:', city.name)
    
    // 添加到首页
    this.addCityToHome(city)
  },

  /**
   * 选择时区分组
   */
  selectTimezoneGroup(e) {
    const group = e.currentTarget.dataset.group
    console.log('选择时区分组:', group.name)
    
    // 显示该时区的城市列表
    wx.showActionSheet({
      itemList: group.timezones.map(tz => `${tz.name} (${tz.country})`),
      success: (res) => {
        const selectedTimezone = group.timezones[res.tapIndex]
        this.addCityToHome(selectedTimezone)
      }
    })
  },

  /**
   * 添加城市到首页
   */
  addCityToHome(city) {
    try {
      const savedCities = wx.getStorageSync(Constants.STORAGE_KEYS.SELECTED_CITIES) || []
      
      // 检查是否已存在
      const exists = savedCities.some(c => c.timezone === city.timezone)
      if (exists) {
        wx.showToast({
          title: '城市已存在',
          icon: 'none'
        })
        return
      }
      
      // 添加到列表
      savedCities.push(city)
      wx.setStorageSync(Constants.STORAGE_KEYS.SELECTED_CITIES, savedCities)
      
      wx.showToast({
        title: '添加成功',
        icon: 'success'
      })
      
      // 返回首页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      
    } catch (error) {
      console.error('添加城市失败:', error)
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      })
    }
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
    
    wx.showModal({
      title: city.name,
      content: `时区: ${city.timezone}\n国家: ${city.country}`,
      confirmText: '添加到首页',
      success: (res) => {
        if (res.confirm) {
          this.addCityToHome(city)
        }
      }
    })
  },

  /**
   * 添加选中的城市
   */
  addSelectedCities() {
    if (this.data.selectedCities.length === 0) {
      wx.showToast({
        title: '请先选择城市',
        icon: 'none'
      })
      return
    }
    
    try {
      const savedCities = wx.getStorageSync(Constants.STORAGE_KEYS.SELECTED_CITIES) || []
      const newCities = [...savedCities, ...this.data.selectedCities]
      
      wx.setStorageSync(Constants.STORAGE_KEYS.SELECTED_CITIES, newCities)
      
      wx.showToast({
        title: `已添加 ${this.data.selectedCities.length} 个城市`,
        icon: 'success'
      })
      
      // 返回首页
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      
    } catch (error) {
      console.error('添加城市失败:', error)
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      })
    }
  },

  /**
   * 刷新数据
   */
  refreshData() {
    this.loadSearchHistory()
    this.loadPopularCities()
    this.loadTimezoneGroups()
    wx.stopPullDownRefresh()
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    })
  }
})
