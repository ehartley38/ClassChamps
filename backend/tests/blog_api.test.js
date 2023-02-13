const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const { application } = require('express')

beforeEach(async () => {
    await Blog.deleteMany({})

    // All promises need to be met in the promise array before continuing (?)
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
    test('all blogs are returned', async () => {
        try {
            const response = await api
                .get('/api/blogs')
                .expect('Content-Type', /application\/json/)
    
            expect(response.body).toHaveLength(helper.initialBlogs.length)
        } catch (error) {
            console.error(error)
        }
    })

    test('deleting a blog is successful', async () => {
        const idToDelete = '5a422a851b54a676234d17f7'
        await api
            .delete(`/api/blogs/${idToDelete}`)
            .expect(204)
        
        const deletedBlog = await Blog.findById(idToDelete)
        expect(deletedBlog).toBeNull()
    })
})


describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
        const newBlog = {
            "title": "testing",
            "author": "Ed",
            "url": "www.test.com",
            "likes": 1
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain("testing")
    })
})


afterAll(() => {
    mongoose.connection.close()
  })
