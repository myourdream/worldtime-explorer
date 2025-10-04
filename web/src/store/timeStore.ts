// src/store/timeStore.ts - 时间状态管理

import { create } from 'zustand';
import { TimezoneInfo } from '@shared/timezone';
import { DEFAULT_CITIES, STORAGE_KEYS } from '@shared/constants';

interface TimeState {
  // 当前时间
  currentTime: Date;
  
  // 城市列表
  cities: TimezoneInfo[];
  
  // 收藏城市
  favoriteCities: TimezoneInfo[];
  
  // 本地时区
  localTimezone: string;
  
  // 加载状态
  isLoading: boolean;
  
  // 错误状态
  hasError: boolean;
  errorMessage: string;
  
  // 用户偏好
  showSeconds: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  
  // 搜索历史
  searchHistory: string[];
  
  // 转换历史
  conversionHistory: Array<{
    from: string;
    to: string;
    time: string;
    result: string;
    timestamp: number;
  }>;
}

interface TimeActions {
  // 时间更新
  updateCurrentTime: () => void;
  
  // 城市管理
  addCity: (city: TimezoneInfo) => void;
  removeCity: (timezone: string) => void;
  updateCities: (cities: TimezoneInfo[]) => void;
  
  // 收藏管理
  toggleFavorite: (city: TimezoneInfo) => void;
  addToFavorites: (city: TimezoneInfo) => void;
  removeFromFavorites: (timezone: string) => void;
  
  // 设置管理
  setShowSeconds: (show: boolean) => void;
  setAutoRefresh: (auto: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setLocalTimezone: (timezone: string) => void;
  
  // 搜索管理
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  
  // 转换管理
  addConversionHistory: (conversion: TimeState['conversionHistory'][0]) => void;
  clearConversionHistory: () => void;
  
  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: boolean, message?: string) => void;
  clearError: () => void;
  
  // 数据持久化
  saveToStorage: () => void;
  loadFromStorage: () => void;
  
  // 重置
  reset: () => void;
}

type TimeStore = TimeState & TimeActions;

const initialState: TimeState = {
  currentTime: new Date(),
  cities: DEFAULT_CITIES,
  favoriteCities: [],
  localTimezone: 'Asia/Shanghai',
  isLoading: false,
  hasError: false,
  errorMessage: '',
  showSeconds: true,
  autoRefresh: true,
  refreshInterval: 1000,
  searchHistory: [],
  conversionHistory: []
};

export const useTimeStore = create<TimeStore>((set, get) => ({
  ...initialState,

  // 更新时间
  updateCurrentTime: () => {
    set({ currentTime: new Date() });
  },

  // 添加城市
  addCity: (city: TimezoneInfo) => {
    const { cities } = get();
    if (!cities.find(c => c.timezone === city.timezone)) {
      const newCities = [...cities, city];
      set({ cities: newCities });
      get().saveToStorage();
    }
  },

  // 移除城市
  removeCity: (timezone: string) => {
    const { cities } = get();
    const newCities = cities.filter(c => c.timezone !== timezone);
    set({ cities: newCities });
    get().saveToStorage();
  },

  // 更新城市列表
  updateCities: (cities: TimezoneInfo[]) => {
    set({ cities });
    get().saveToStorage();
  },

  // 切换收藏状态
  toggleFavorite: (city: TimezoneInfo) => {
    const { favoriteCities } = get();
    const isFavorite = favoriteCities.find(c => c.timezone === city.timezone);
    
    if (isFavorite) {
      get().removeFromFavorites(city.timezone);
    } else {
      get().addToFavorites(city);
    }
  },

  // 添加到收藏
  addToFavorites: (city: TimezoneInfo) => {
    const { favoriteCities } = get();
    if (!favoriteCities.find(c => c.timezone === city.timezone)) {
      const newFavorites = [...favoriteCities, city];
      set({ favoriteCities: newFavorites });
      get().saveToStorage();
    }
  },

  // 从收藏移除
  removeFromFavorites: (timezone: string) => {
    const { favoriteCities } = get();
    const newFavorites = favoriteCities.filter(c => c.timezone !== timezone);
    set({ favoriteCities: newFavorites });
    get().saveToStorage();
  },

  // 设置显示秒
  setShowSeconds: (show: boolean) => {
    set({ showSeconds: show });
    get().saveToStorage();
  },

  // 设置自动刷新
  setAutoRefresh: (auto: boolean) => {
    set({ autoRefresh: auto });
    get().saveToStorage();
  },

  // 设置刷新间隔
  setRefreshInterval: (interval: number) => {
    set({ refreshInterval: interval });
    get().saveToStorage();
  },

  // 设置本地时区
  setLocalTimezone: (timezone: string) => {
    set({ localTimezone: timezone });
    get().saveToStorage();
  },

  // 添加搜索历史
  addSearchHistory: (query: string) => {
    const { searchHistory } = get();
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    set({ searchHistory: newHistory });
    get().saveToStorage();
  },

  // 清除搜索历史
  clearSearchHistory: () => {
    set({ searchHistory: [] });
    get().saveToStorage();
  },

  // 添加转换历史
  addConversionHistory: (conversion: TimeState['conversionHistory'][0]) => {
    const { conversionHistory } = get();
    const newHistory = [conversion, ...conversionHistory].slice(0, 20);
    set({ conversionHistory: newHistory });
    get().saveToStorage();
  },

  // 清除转换历史
  clearConversionHistory: () => {
    set({ conversionHistory: [] });
    get().saveToStorage();
  },

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // 设置错误状态
  setError: (error: boolean, message: string = '') => {
    set({ hasError: error, errorMessage: message });
  },

  // 清除错误
  clearError: () => {
    set({ hasError: false, errorMessage: '' });
  },

  // 保存到本地存储
  saveToStorage: () => {
    try {
      const state = get();
      const dataToSave = {
        cities: state.cities,
        favoriteCities: state.favoriteCities,
        localTimezone: state.localTimezone,
        showSeconds: state.showSeconds,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
        searchHistory: state.searchHistory,
        conversionHistory: state.conversionHistory
      };
      
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('保存到本地存储失败:', error);
    }
  },

  // 从本地存储加载
  loadFromStorage: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      if (saved) {
        const data = JSON.parse(saved);
        set({
          cities: data.cities || DEFAULT_CITIES,
          favoriteCities: data.favoriteCities || [],
          localTimezone: data.localTimezone || 'Asia/Shanghai',
          showSeconds: data.showSeconds !== undefined ? data.showSeconds : true,
          autoRefresh: data.autoRefresh !== undefined ? data.autoRefresh : true,
          refreshInterval: data.refreshInterval || 1000,
          searchHistory: data.searchHistory || [],
          conversionHistory: data.conversionHistory || []
        });
      }
    } catch (error) {
      console.error('从本地存储加载失败:', error);
    }
  },

  // 重置状态
  reset: () => {
    set(initialState);
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
  }
}));
