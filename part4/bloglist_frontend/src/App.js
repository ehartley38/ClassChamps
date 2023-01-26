import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successNotification, setSuccessNotification] = useState(null)
  const [errorNotification, setErrorNotification] = useState(null)

  useEffect(() => {
    blogService.getAll()
      .then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logoutUser = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // Set error message popup here
      setErrorNotification('Wrong username or password')
      setTimeout(() => {setErrorNotification(null)}, 5000)

    }
  }

  // This addBlog is called in the BlogForm component so that the blog object can 
  // be passed without needing to import the blogService into the BlogForm
  const addBlog = (blogObject) => {
    // See 5b props.children and proptypes if youre confused
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
    
    setSuccessNotification(`A new blog: ${blogObject.title} by ${blogObject.author} has been added`)
    setTimeout(() => {setSuccessNotification(null)}, 5000)
  }

  // This addLike is called in the Blog component
  const addLike = (blogObject) => {
    blogService
      .edit(blogObject)
      .then(returnedBlog => {
        const updatedBlogs = blogs.map(b => {
          if (b.id === returnedBlog.id) {
            return returnedBlog
          }
          return b
        })
        setBlogs(updatedBlogs)
      })
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel="New blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} user={user} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <Notification message={errorNotification} className={"error"} />
        <h2>Log in to application</h2>
        <LoginForm handleLogin={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword} /> 
      </div>
    )
  }

  return (
    <div>
      <Notification message={successNotification} className={"success"} />
      <h2>Blogs</h2>
      <h3>{user.username} has logged in</h3>

      <button onClick={logoutUser}>Logout</button> 

      {blogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} newLike={addLike} />
      )}


    </div>
  )
}

export default App