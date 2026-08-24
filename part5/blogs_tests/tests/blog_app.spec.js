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
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'matti',
        username: 'matti',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173/')
  })

  // test('Login form is shown', async ({ page }) => {
  //   await page.getByRole('button', { name:'login' }).click()
  //   const usernameInput = page.getByText('username')
  //   const passwordInput = page.getByText('password')

  //   expect(usernameInput).toBeVisible()
  //   expect(passwordInput).toBeVisible()
  // })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'aada', 'salainen')
      await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible()
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

      await expect(page.getByRole('link', { name:'a note by playwright by playwright' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'a note by playwright', 'playwright', 'http:playwright')

      await page.getByRole('link', { name: 'a note by playwright by playwright' }).click()
      const likeRow = page.getByRole('button', { name: 'like' }).locator('..')
      await expect(likeRow).toContainText('likes 0')
      
      await page.getByRole('button', { name: 'like' }).click()
      await expect(likeRow).toContainText('likes 1')
    })

    test('a blog can be deleted by the user who added it', async ({ page }) => {
      await createBlog(page, 'a note by playwright', 'playwright', 'http:playwright')
      await page.getByRole('link', { name: 'a note by playwright by playwright' }).click()

      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('a note by playwright')
        await dialog.accept()
        })
      const blog = page.getByRole('button', { name: 'remove' }).locator('..')
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(blog).not.toBeVisible()
    })
    test('blog created by aada cannot be removed by matti', async ({ page }) => {
      await createBlog(page, 'a blog by playwright aada', 'playwright-aada', 'http:playwright')
      await page.getByRole('button', { name:'Log out' }).click()
      await loginWith(page, 'matti', 'salainen')
      await expect(page.getByRole('button','Log out')).toBeVisible()

      await page.getByRole('link', { name: 'a blog by playwright aada by playwright-aada' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    // test('blogs are arranged in most liked order', async ({ page }) => {
    //   await createBlog(page, 'second', 'playwright-aada', 'http:playwright')
    //   await createBlog(page, 'most liked', 'playwright-aada', 'http:playwright')

    //   const most_liked = page.getByTestId('blog').filter({ hasText:'most liked' })
    //   await most_liked.getByRole('button', { name:'view' }).click()
    //   await most_liked.getByRole('button', { name:'like' }).click()

    //   const blogs = page.getByTestId('blog')
    //   await expect(blogs.nth(0)).toContainText('most liked')
    //   await expect(blogs.nth(1)).toContainText('second')
    // })
  })
})