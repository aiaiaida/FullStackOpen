const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name:'login' }).click()
    const usernameInput = page.getByText('username')
    const passwordInput = page.getByText('password')

    expect(usernameInput).toBeVisible()
    expect(passwordInput).toBeVisible()
  })
})