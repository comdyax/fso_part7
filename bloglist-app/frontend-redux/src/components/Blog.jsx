import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'


const Blog = ({ blog, user, reloadBlogs, addLike }) => {
  const [hide, setHide] = useState(true)

  const changeHide = () => {
    setHide(!hide)
  }

  const removeBlog = async () => {
    try {
      if (window.confirm(`Delete blog '${blog.title}' by ${blog.author}?`)) {
        await blogService.deleteBlog(blog.id)
        reloadBlogs()
      }
    } catch (exc) {
      console.log(exc)
    }
  }

  const newLike = () => {
    const newBlogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id
    }
    addLike(newBlogObject)
  }

  const showNot = { display: hide ? 'none' : '' }
  const show = { display: hide ? '' : 'none' }
  const removeButtonStyle = {
    display: user.username === blog.user.username ? '' : 'none',
    backgroundColor: 'blue',
    border: '3px',
    borderRadius: '3px',
    padding: '4px 4px',
    margin: '10px 10px',
    color: 'white'
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blogDiv'>
      <div className='defaultValues'>
        <b>title:</b> {blog.title}
        <br></br>
        <b>author:</b> {blog.author}
        <br></br>
        <button style={show} onClick={changeHide} id='showDetails-button'>show details</button>
        <button style={showNot} onClick={changeHide}>close details</button>
      </div>
      <div style={showNot} className='detailValues'>
        <b>url:</b> {blog.url}
        <br></br>
        <b>likes:</b> {blog.likes}
                &emsp;
        <button onClick={newLike} id='like-button'>like</button>
        <br></br>
        <b>username:</b> {blog.user.username}
        <br></br>
        <button style={removeButtonStyle} onClick={removeBlog} id='remove-button'>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  reloadBlogs: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired

}

export default Blog