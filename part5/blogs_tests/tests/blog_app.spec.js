const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
      await createBlog(page, 'a note by playwright', 'playwright', 'http:playwright')

      const infoDiv = page.locator('.info')
      await expect(infoDiv).toContainText('a note by playwright')

      const blog = page.getByRole('button', { name: 'view' }).locator('..')
      await expect(blog).toContainText('a note by playwright')
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'a note by playwright', 'playwright', 'http:playwright')

      await page.getByRole('button', { name: 'view' }).click()
      const likeRow = page.getByRole('button', { name: 'like' }).locator('..')
      await expect(likeRow).toContainText('likes 0')
      
      await page.getByRole('button', { name: 'like' }).click()
      await expect(likeRow).toContainText('likes 1')
    })

    test('a blog can be deleted by the user who added it', async ({ page }) => {
      await createBlog(page, 'a note by playwright again', 'playwright', 'http:playwright')
      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('a note by playwright again')
        await dialog.accept()
  })
      const blog = page.getByRole('button', { name: 'remove' }).locator('..')
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(blog).not.toBeVisible()
    })
  })
})