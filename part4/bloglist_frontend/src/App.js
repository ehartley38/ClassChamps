import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')
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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
      user: user.id
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewAuthor('')
        setNewTitle('')
        setNewURL('')
      })
    
    setSuccessNotification(`A new blog: ${blogObject.title} by ${blogObject.author} has been added`)
    setTimeout(() => {setSuccessNotification(null)}, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Title
        <input
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        Author
        <input
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        URL
        <input
          value={newURL}
          onChange={({ target }) => setNewURL(target.value)}
        />
      </div> 
      <button type="submit">save</button>
    </form>  
  )

  if (user === null) {
    return (
      <div>
        <Notification message={errorNotification} className={"error"} />
        <h2>Log in to application</h2>
        {loginForm()} 
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
        <Blog key={blog.id} blog={blog} />
      )}


    </div>
  )
}

export default App