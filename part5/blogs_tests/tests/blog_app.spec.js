const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'aada',
        username: 'aada',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name:'login' }).click()
    const usernameInput = page.getByText('username')
    const passwordInput = page.getByText('password')

    expect(usernameInput).toBeVisible()
    expect(passwordInput).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'aada', 'wrong')
      await expect(page.getByText('logged in')).toBeVisible()
    })
    
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'aada', 'wrong')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
    })
  })
})