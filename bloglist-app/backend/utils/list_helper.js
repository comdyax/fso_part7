var _ = require('lodash')

const dummy = (blogs) => {
    const result = blogs
    const number = 1
    return number === 1 ? 1 : result.length
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.map(blog => blog.likes).reduce((accu, value) => accu + value, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0)
        return {}
    let highestLikes = 0
    blogs.forEach(blog => {
        if (blog.likes > highestLikes)
            highestLikes = blog.likes
    })
    return blogs.map(blog => {
        return {
            title: blog.title,
            author: blog.author,
            likes: blog.likes
        }
    })
        .find(blog => blog.likes === highestLikes)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0)
        return {}
    //Create (uniq) List of Authors with additional blogs field (initial value 0)
    const authors =
        _.uniq(blogs.map(blog => blog.author))
            .map(author => {
                return {
                    author: author,
                    blogs: 0
                }
            })
    //Count for each Author the number of blogs and give the value to the field blogs
    //initialize the max var with the highest blog count
    let max = 0
    authors.forEach(author => {
        author.blogs = blogs.filter(blog =>
            blog.author === author.author)
            .length
        if (author.blogs > max)
            max = author.blogs
    })
    //Return only the Author(Object) with the most blogs (the first, if more than one)
    return authors.find(author => author.blogs === max)
}

const mostLikes = (blogs) => {
    if (blogs.length === 0)
        return {}
    //Create (uniq) List of Authors with additional likes field (initial value 0)
    const authors =
        _.uniq(blogs.map(blog => blog.author))
            .map(author => {
                return {
                    author: author,
                    likes: 0
                }
            })
    //max value of likes between authors for finding (first)author with most likes afterwards
    let max = 0
    /**initializes/updates the max variable by each call
     *
     * @param {*String of the name of the Author} author
     * @returns sum of all likes a author has in the blogs list
     */
    const getLikes = (author) => {
        let likes = 0
        blogs.forEach(blog => {
            if (blog.author === author)
                likes += blog.likes
        })
        if(likes > max)
            max = likes
        return likes
    }
    //Set the sum of Likes of all blogs for each author
    authors.forEach(author => author.likes = getLikes(author.author))
    //return the author Object with most likes (first if more than one)
    return authors.find(author => author.likes === max)
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }