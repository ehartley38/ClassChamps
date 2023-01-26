import { useState } from "react"

const Blog = ({ blog, newLike }) => {
  const [displayBlog, setDisplayBlog] = useState(false)

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
    //event.preventDefault()
    // Build the object we want to increase likes by here
    const newObject = {...blog, likes: blog.likes + 1} 
    newLike(newObject)
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