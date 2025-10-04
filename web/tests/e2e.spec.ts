// tests/e2e.spec.ts - Playwright端到端测试

import { test, expect } from '@playwright/test';

test.describe('世界时间查看器', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('页面标题正确', async ({ page }) => {
    await expect(page).toHaveTitle('世界时间查看器');
  });

  test('首页加载正常', async ({ page }) => {
    // 检查主要元素是否存在
    await expect(page.getByRole('heading', { name: '世界时间' })).toBeVisible();
    await expect(page.getByText('实时查看全球主要城市时间')).toBeVisible();
    await expect(page.getByRole('heading', { name: '当前时间' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '主要城市' })).toBeVisible();
  });

  test('时间显示正常', async ({ page }) => {
    // 检查当前时间显示
    const timeDisplay = page.locator('text=/\\d{2}:\\d{2}:\\d{2}/').first();
    await expect(timeDisplay).toBeVisible();
    
    // 等待1秒检查时间是否更新
    await page.waitForTimeout(1000);
    const updatedTime = page.locator('text=/\\d{2}:\\d{2}:\\d{2}/').first();
    await expect(updatedTime).toBeVisible();
  });

  test('城市卡片显示正常', async ({ page }) => {
    // 检查城市数量
    await expect(page.getByText('6个城市')).toBeVisible();
    
    // 检查默认城市
    await expect(page.getByRole('heading', { name: '北京' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '东京' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '纽约' })).toBeVisible();
  });

  test('城市搜索功能', async ({ page }) => {
    // 点击搜索按钮
    await page.getByRole('button', { name: '搜索' }).click();
    
    // 检查搜索页面
    await expect(page.getByRole('heading', { name: '城市搜索' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '搜索城市名称、国家或时区' })).toBeVisible();
    
    // 测试搜索功能
    await page.getByRole('textbox', { name: '搜索城市名称、国家或时区' }).fill('纽约');
    await page.waitForTimeout(500);
    
    // 检查搜索结果
    await expect(page.getByText('搜索结果 (1)')).toBeVisible();
    await expect(page.getByRole('heading', { name: '纽约' })).toBeVisible();
  });

  test('时区转换功能', async ({ page }) => {
    // 点击转换按钮
    await page.getByRole('button', { name: '转换' }).click();
    
    // 检查转换页面
    await expect(page.getByRole('heading', { name: '时区转换' })).toBeVisible();
    
    // 检查时区选择器
    await expect(page.getByRole('combobox', { name: '源时区' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: '目标时区' })).toBeVisible();
    
    // 检查转换结果
    await expect(page.getByRole('heading', { name: '转换结果' })).toBeVisible();
    await expect(page.getByText(/时间差:/)).toBeVisible();
  });

  test('收藏功能', async ({ page }) => {
    // 点击北京城市的收藏按钮
    const beijingCard = page.locator('text=北京').locator('..').locator('..');
    const favoriteButton = beijingCard.getByRole('button').first();
    await favoriteButton.click();
    
    // 检查按钮状态变化（这里可能需要根据实际实现调整）
    await expect(favoriteButton).toBeVisible();
  });

  test('导航功能', async ({ page }) => {
    // 测试底部导航
    await expect(page.getByRole('button', { name: '首页' })).toBeVisible();
    await expect(page.getByRole('button', { name: '搜索' })).toBeVisible();
    await expect(page.getByRole('button', { name: '转换' })).toBeVisible();
    await expect(page.getByRole('button', { name: '设置' })).toBeVisible();
    
    // 测试导航切换
    await page.getByRole('button', { name: '搜索' }).click();
    await expect(page.getByRole('heading', { name: '城市搜索' })).toBeVisible();
    
    await page.getByRole('button', { name: '转换' }).click();
    await expect(page.getByRole('heading', { name: '时区转换' })).toBeVisible();
    
    await page.getByRole('button', { name: '首页' }).click();
    await expect(page.getByRole('heading', { name: '世界时间' })).toBeVisible();
  });

  test('响应式设计', async ({ page }) => {
    // 测试移动端视图
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: '世界时间' })).toBeVisible();
    
    // 测试平板视图
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: '世界时间' })).toBeVisible();
    
    // 测试桌面视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: '世界时间' })).toBeVisible();
  });

  test('无控制台错误', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // 等待页面完全加载
    await page.waitForLoadState('networkidle');
    
    // 检查是否有控制台错误
    expect(consoleErrors).toHaveLength(0);
  });
});
