const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./blog_test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

let token = null

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogList = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray1 = blogList.map(blog => blog.save())
    await Promise.all(promiseArray1)

    const user = {
        username: 'maxblog',
        name: 'max',
        password: '242424'
    }

    await api.post('/api/users').send(user)

    const res = await api.post('/api/login').send(user)
    token = res.body.token
})

describe('database format', () => {
    test('all blogs are returned in correct json format', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('field id exists', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('default likes value', async () => {
        const newBlog = {
            title: '2525253 test',
            author: 'some dude',
            url: 'some url',
        }
        const response = await api
            .post('/api/blogs')
            .set({ Authorization: `Bearer ${token}` })
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await helper.blogsInDb()
        const blog = blogs.find(blog => blog.id === response.body.id)
        expect(blog.likes).toBe(0)
        expect(response.body.likes).toBe(0)
    })
})

describe('error testing', () => {
    test('error message when title field is missing', async () => {
        const newBlog = {
            author: 'some dude',
            url: 'some url',
        }
        const response = await api
            .post('/api/blogs')
            .set({ Authorization: `Bearer ${token}` })
            .send(newBlog)
            .expect(400)

        expect(response.body.error).toEqual('Blog validation failed: title: Path `title` is required.')
    })

    test('error message when url field is missing', async () => {
        const newBlog = {
            title: '2525253 test',
            author: 'some dude',
        }
        const response = await api
            .post('/api/blogs')
            .set({ Authorization: `Bearer ${token}` })
            .send(newBlog)
            .expect(400)

        expect(response.body.error).toEqual('Blog validation failed: url: Path `url` is required.')
    })

    test('correct error if no token is provided while adding a blog', async () => {
        const newBlog = {
            author: 'some dude',
            url: 'some url',
        }
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        expect(response.body.error).toEqual('jwt must be provided')
    })
})

describe('change database', () => {
    test('succesfull post request to db', async () => {
        const newBlog = {
            title: '2525253 test',
            author: 'some dude',
            url: 'some url',
            likes: 140
        }
        await api
            .post('/api/blogs')
            .set({ Authorization: `Bearer ${token}` })
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
        expect(blogs.map(blog => blog.title)).toContain(newBlog.title)
        expect(blogs.map(blog => blog.author)).toContain(newBlog.author)
        expect(blogs.map(blog => blog.url)).toContain(newBlog.url)
    })

    test('deleting a single blog post', async () => {
        const newBlog = {
            title: 'blogtitle',
            author: 'memyself',
            url: 'urlurlrul',
            likes: 1
        }
        await api
            .post('/api/blogs')
            .set({ Authorization: `Bearer ${token}` })
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtStart = await helper.blogsInDb()
        const id = blogsAtStart[blogsAtStart.length - 1].id
        await api
            .delete(`/api/blogs/${id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
        expect(blogsAtEnd.map(blogs => blogs.id)).not.toContain(id)
    })

    test('update a single blog post', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const updateBlog = blogsAtStart[0]
        updateBlog.author = 'new author'
        updateBlog.url = 'new url'
        updateBlog.likes = 1

        const response = await api
            .put(`/api/blogs/${updateBlog.id}`)
            .send(updateBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual(updateBlog)
        const blogs = await helper.blogsInDb()
        expect(blogs).toHaveLength(helper.initialBlogs.length)
        expect(blogs.map(blog => blog.title)).toContain(updateBlog.title)
        expect(blogs.map(blog => blog.author)).toContain(updateBlog.author)
        expect(blogs.map(blog => blog.url)).toContain(updateBlog.url)
    })
})



afterAll(async () => {
    await mongoose.connection.close()
})