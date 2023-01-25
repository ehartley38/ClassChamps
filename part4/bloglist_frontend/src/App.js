import { useState, useEffect } from 'react'
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
    blogService.getAll().then(blogs =>
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

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        /*
        setNewAuthor('')
        setNewTitle('')
        setNewURL('')*/
      })
    
    setSuccessNotification(`A new blog: ${blogObject.title} by ${blogObject.author} has been added`)
    setTimeout(() => {setSuccessNotification(null)}, 5000)
  }

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

      <Togglable buttonLabel="New blog">
        <BlogForm createBlog={addBlog} user={user} />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}


    </div>
  )
}

export default App