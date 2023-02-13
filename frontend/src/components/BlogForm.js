import { useState } from 'react' 

const BlogForm = ({ createBlog, user }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newURL, setNewURL] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newURL,
            user: user.id
        })

        setNewTitle('')
        setNewAuthor('')
        setNewURL('')
    }

    return (
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
}

export default BlogForm