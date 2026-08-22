import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('shows only title and author by default', () => {
  const blog = {
    title: "a test blog",
    author: "me",
    url: "https:...",
    likes: 10
  }

  render(<Blog blog={blog}/>)

  const title = screen.getByText('a test blog', { exact: false })
  const author = screen.getByText('me', { exact: false })

  expect(title).toBeVisible()
  expect(author).toBeVisible()

  const url = screen.queryByText('https:...', { exact: false })
  const likes = screen.queryByText('10', { exact: false })

  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('url and likes shown when view button clicked', async () => {
  const blog = {
    title: "a test blog",
    author: "me",
    url: "https:...",
    likes: 10
  }

  render(<Blog blog={blog}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')

  await user.click(button)

  const url = screen.getByText('https:...', { exact: false })
  const likes = screen.getByText('10', { exact: false })

  expect(url).toBeVisible()
  expect(likes).toBeVisible()
})