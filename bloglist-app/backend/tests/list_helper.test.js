const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const equalCountBlogs = [
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 20,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 20,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 20,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 20,
        __v: 0
    }
]

const blogsWithSameLikes = [
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 20,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 20,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 20,
        __v: 0
    }
]
const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('list with many blogs', () => {
        expect(listHelper.totalLikes(blogs)).toBe(36)
    })

    test('empty list expect 0', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })
})

describe('favorite Blog', () => {
    test('only one blog', () => {
        const result = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5,
        }
        expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(result)
    })
    test('one blog in list with highest Likes', () => {
        const result = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12,
        }
        expect(listHelper.favoriteBlog(blogs)).toEqual(result)
    })
    test('empty blog list', () => {
        const result = {}
        expect(listHelper.favoriteBlog([])).toEqual(result)
    })
    test('more than one blog with same highest likes count; return first', () => {
        const result = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            likes: 20
        }
        expect(listHelper.favoriteBlog(blogsWithSameLikes)).toEqual(result)
    })
})

describe('most blogs', () => {
    test('list of blogs with one author with most blogs', () => {
        const result = {
            author: 'Robert C. Martin',
            blogs: 3
        }
        expect(listHelper.mostBlogs(blogs)).toEqual(result)
    })
    test('empty list', () => {
        expect(listHelper.mostBlogs([])).toEqual({})
    })
    test('list with one element', () => {
        const result = {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        }
        expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(result)
    })
    test('list with more equal most Blog authors', () => {
        const result = {
            author: 'Edsger W. Dijkstra',
            blogs: 2
        }
        expect(listHelper.mostBlogs(equalCountBlogs)).toEqual(result)
    })
})

describe('most likes', () => {
    test('empty list', () => {
        expect(listHelper.mostLikes([])).toEqual({})
    })
    test('list with one Blog', () => {
        const result = {
            author: 'Edsger W. Dijkstra',
            likes: 5
        }
        expect(listHelper.mostLikes(listWithOneBlog)).toEqual(result)
    })
    test('list with many authors and one max', () => {
        const result = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }
        expect(listHelper.mostLikes(blogs)).toEqual(result)
    })

    test('list with equal famous blog authors expect first', () => {
        const result = {
            author: 'Edsger W. Dijkstra',
            likes: 40
        }
        expect(listHelper.mostLikes(equalCountBlogs)).toEqual(result)
    })
})