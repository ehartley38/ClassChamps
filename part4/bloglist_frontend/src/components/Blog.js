import { useState, useEffect } from "react"

const Blog = ({ blog, newLike, blogDelete, user }) => {
  const [displayBlog, setDisplayBlog] = useState(true)
  const [isUserBlog, setIsUserBlog] = useState(false)
  
  useEffect(() => {
    setIsUserBlog(user.username === blog.user.username)
  }, [user, blog])


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


  return (
    <div style={blogStyle} className='blog'>
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
            {blog.user.username}
          </div>
          {isUserBlog ? (
            <div>
              <button onClick={() => blogDelete(blog)}>Remove</button>
            </div>
          ) : null}
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