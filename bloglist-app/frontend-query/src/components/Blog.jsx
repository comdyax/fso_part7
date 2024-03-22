import { useState } from "react";
import blogService from "../services/blogs";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card } from "react-bootstrap";

const Blog = ({ blog, user, addLike }) => {
  const queryClient = useQueryClient();
  const [hide, setHide] = useState(true);

  const changeHide = () => {
    setHide(!hide);
  };

  const removeBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const removeBlog = async () => {
    try {
      if (window.confirm(`Delete blog '${blog.title}' by ${blog.author}?`)) {
        await removeBlogMutation.mutateAsync(blog.id);
      }
    } catch (exc) {
      console.log(exc);
    }
  };

  const newLike = () => {
    const newBlogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id,
    };
    addLike(newBlogObject);
  };

  const showNot = { display: hide ? "none" : "", padding: "5px" };
  const show = { display: hide ? "" : "none", padding: "5px" };
  const removeButtonStyle = {
    display: user.username === blog.user.username ? "" : "none",
    padding: "5px",
  };

  return (
    <Card style={{ backgroundColor: "#eeffcc" }}>
      <Card.Body>
        <Card.Title>{blog.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{blog.author}</Card.Subtitle>
        <br></br>
        <Button
          variant="primary"
          style={show}
          onClick={changeHide}
          id="showDetails-button"
        >
          show details
        </Button>
        <Button variant="success" style={showNot} onClick={changeHide}>
          close details
        </Button>
        <div style={showNot} className="detailValues">
          <b>url:</b> {blog.url}
          <br></br>
          <b>likes:</b> {blog.likes}
          &emsp;
          <Button variant="light" onClick={newLike} id="like-button">
            like
          </Button>
          <br></br>
          <b>username:</b> {blog.user.username}
          <br></br>
          <Button
            variant="danger"
            style={removeButtonStyle}
            onClick={removeBlog}
            id="remove-button"
          >
            remove
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
};

export default Blog;
