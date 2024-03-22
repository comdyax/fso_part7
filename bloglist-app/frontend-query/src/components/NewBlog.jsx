import { useState } from "react";
import { Form, Button } from "react-bootstrap";

const NewBlog = ({ createBlog }) => {
  const [url, setUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: title,
      author: author,
      url: url,
    });
    setUrl("");
    setAuthor("");
    setTitle("");
  };

  return (
    <>
      <h2>create new blog</h2>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            id="title"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            id="author"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            id="url"
          />
        </Form.Group>
        <br></br>
        <Button variant="primary" type="submit" id="create-blog">
          create blog
        </Button>
      </Form>
    </>
  );
};

export default NewBlog;
