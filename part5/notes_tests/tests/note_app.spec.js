const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'aada',
        username: 'aada',
        password: 'salainen'
      }
    })
    
    await page.goto('/')
  })
  
  test('front page can be opened', async ({ page }) => {
  const locator = page.getByText('Notes')
  await expect(locator).toBeVisible()
  await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2026')).toBeVisible()
  })

  test('user can log in', async ({ page }) => {
    await loginWith(page, 'aada', 'salainen')
    await expect(page.getByText('Aada Siini logged in')).toBeVisible()
  })

  test.only('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'aada', 'wrong')
    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('aada logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'aada', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a new note being created by a playwright test')
      await expect(page.getByText('a new note being created by a playwright test')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'show all' }).click()
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..')
        
        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})