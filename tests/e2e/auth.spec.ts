import { test, expect } from '@playwright/test'

test('register and login flow', async ({ page }) => {
  // Register
  await page.goto('/register')
  await page.fill('[id="fullName"]', 'Test User')
  await page.fill('[id="email"]', `test${Date.now()}@example.com`)
  await page.fill('[id="password"]', 'password123')
  await page.fill('[id="confirmPassword"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page.locator('text=Đăng ký thành công')).toBeVisible({ timeout: 5000 })
})

test('home page loads movies', async ({ page }) => {
  // Login first
  await page.goto('/login')
  // ... login logic
  await page.goto('/')
  await expect(page.locator('text=Phim Mới Cập Nhật')).toBeVisible()
})
