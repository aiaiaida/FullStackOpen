const BlogForm = ({ addBlog, title, author, url, handleTitleChange, handleAuthorChange, handleUrlChange }) => (
  <form onSubmit={addBlog}>
        <div>
          <label> title:
            <input value={title} onChange={handleTitleChange}/>
          </label>
        </div>
        <div>
          <label> author:
            <input value={author} onChange={handleAuthorChange}/>
          </label>
        </div>
        <div>
          <label> url:
            <input value={url} onChange={handleUrlChange}/>
          </label>
        </div>
        <button type='submit'>create</button>
      </form>
)

export default BlogForm