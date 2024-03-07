const blogRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')
require('express-async-errors')


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    return response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body

    const user = await User.findById(request.user.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })
    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    return response.status(201).json(result)
})

blogRouter.delete('/:id', middleware.userExtractor,  async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    const user = request.user

    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).end()
    } else {
        return response.status(401).json({ error: 'token invalid' })
    }
})

blogRouter.put('/:id', async (request, response) => {
    const updateBlog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new: true })
    return response.json(updatedBlog)
})

module.exports = blogRouter