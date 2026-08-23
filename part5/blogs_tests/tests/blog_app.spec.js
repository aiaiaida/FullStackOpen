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
      await loginWith(page, 'aada', 'salainen')
      await expect(page.getByText('logged in')).toBeVisible()
    })
    
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'aada', 'wrong')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page,'aada','salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.getByLabel('title').fill('a note by playwright')
      await page.getByLabel('author').fill('playwright')
      await page.getByLabel('url').fill('http:playwright')
      await page.getByRole('button', { name: 'create' }).click()

      const infoDiv = page.locator('.info')
      await expect(infoDiv).toContainText('a note by playwright')

      const blog = page.getByRole('button', { name: 'view' }).locator('..')
      await expect(blog).toContainText('a note by playwright')
    })
  })
})