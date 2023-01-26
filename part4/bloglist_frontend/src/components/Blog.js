import { useState } from "react"

const Blog = ({ blog, newLike, blogDelete }) => {
  const [displayBlog, setDisplayBlog] = useState(true)

  const hideWhenVisible = { display: displayBlog ? 'none' : '' }
  const showWhenVisible = { display: displayBlog ? '' : 'none' }

  const toggleVisibility = () => {
    setDisplayBlog(!displayBlog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = () => {
    const newObject = {...blog, likes: blog.likes + 1} 
    newLike(newObject)
  }

  const deleteBlog = () => {
    blogDelete(blog)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>Hide</button>
        <div>
          <div>
            {blog.title} {blog.author}
          </div>
          <div>
            {blog.url}
          </div>
          <div>
            Likes: {blog.likes}
            <button onClick={addLike}>Like</button>
          </div>
          <div>
            Blog username here
          </div>
          <div>
            <button onClick={deleteBlog}>Remove</button>
          </div>
        </div>
      </div>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>View</button>
        <div>
          {blog.title} {blog.author}
        </div>
      </div>
    </div>
  )
}

export default Blog