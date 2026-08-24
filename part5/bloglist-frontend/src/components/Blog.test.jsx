import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('shows only title and author by default', () => {
  const blog = {
    title: 'a test blog',
    author: 'me',
    url: 'https:...',
    likes: 10
  }

  render(<Blog blog={blog}/>)

  const title = screen.getByText('a test blog', { exact: false })
  const author = screen.getByText('me', { exact: false })

  expect(title).toBeVisible()
  expect(author).toBeVisible()

  const url = screen.queryByText('https:...', { exact: false })
  const likes = screen.queryByText('likes 10', { exact: false })

  expect(url).toBeVisible()
  expect(likes).toBeVisible()
})

test('url and likes shown to unauthenticated users buttons not displayed', async () => {
  const blog = {
    title: 'a test blog',
    author: 'me',
    url: 'https:...',
    likes: 10
  }

  render(<Blog blog={blog}/>)

  const url = screen.getByText('https:...', { exact: false })
  const likes = screen.getByText('10', { exact: false })

  expect(url).toBeVisible()
  expect(likes).toBeVisible()

  const likeButton = screen.queryByRole('button', { name: 'like' })
  const removeButton = screen.queryByRole('button', { name: 'remove' })
  expect(likeButton).not.toBeInTheDocument()
  expect(removeButton).not.toBeInTheDocument()
})

test('like button clicked twice and event called twice', async () => {
  const blog = {
    title: 'a test blog',
    author: 'me',
    url: 'https:...',
    likes: 10,
    user: {
      id: 'ID'
    }
  }
  const likeHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={likeHandler} userId={'ID'}/>)

  const user = userEvent.setup()

  const button = screen.queryByRole('button', { name: 'like' })
  await user.click(button)
  await user.click(button)

  expect(likeHandler.mock.calls).toHaveLength(2)
})

test('Authenticated users who are not the blogs creator are shown only the like button', async () => {
  const blog = {
    title: 'a test blog',
    author: 'me',
    url: 'https:...',
    likes: 10,
    user: {
      id: 'ID'
    }
  }
  const likeHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={likeHandler} userId={'different ID'}/>)

  const likeButton = screen.queryByRole('button', { name: 'like' })
  const removeButton = screen.queryByRole('button', { name: 'remove' })
  expect(likeButton).toBeVisible()
  expect(removeButton).not.toBeInTheDocument()
})

test('Creator of the blog sees remove and like buttons', async () => {
  const blog = {
    title: 'a test blog',
    author: 'me',
    url: 'https:...',
    likes: 10,
    user: {
      id: 'ID'
    }
  }
  const likeHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={likeHandler} userId={'ID'}/>)

  const likeButton = screen.queryByRole('button', { name: 'like' })
  const removeButton = screen.queryByRole('button', { name: 'remove' })
  expect(likeButton).toBeVisible()
  expect(removeButton).toBeVisible()
})