import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('new blog is created with correct details', async () => {
  const addBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={addBlog}/>)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')

  await user.type(titleInput, 'test title')
  await user.type(authorInput, 'test author')
  await user.type(urlInput, 'test url')

  const addButton = screen.getByText('create')
  await user.click(addButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('test title')
  expect(addBlog.mock.calls[0][0].author).toBe('test author')
  expect(addBlog.mock.calls[0][0].url).toBe('test url')
  // console.log(addBlog.mock.calls)
})