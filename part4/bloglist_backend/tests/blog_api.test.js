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

afterAll(() => {
    mongoose.connection.close()
  })
