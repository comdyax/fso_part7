import { useState, useEffect, useRef } from "react";

import blogService from "./services/blogs";
import loginService from "./services/login";

import NewBlog from "./components/NewBlog";
import Blogs from "./components/Blogs";
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification";
import Togglable from "./components/Togglable"

const App = () => 
{
  const [updateBlogs, setUpdateBlogs  ] = 
  useState(0);
  const [blogs, setBlogs] = 
  useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = 
  useState("");
  const [password, setPassword] = 
  useState("");

  const [errorMessage,  setErrorMessage ] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  const newBlogRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((blog1, blog2) => {
        return blog1.likes <= blog2.likes ? 1 : -1;
      });
      setBlogs(blogs);
    });
  }, [updateBlogs]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const reloadBlogs = () => {
    setUpdateBlogs(updateBlogs + 1);
  };

  const addLike = async (newBlogObject) => {
    await blogService.updateBlog(newBlogObject);
    setUpdateBlogs(updateBlogs + 1);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
      blogService.setToken(user.token);
    } catch (exc) {
      setErrorMessage("wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  const addNewBlog = async (newBlogObject) => {
    newBlogRef.current.toggleVisibility();
    try {
      const blog = await blogService.addBlog(newBlogObject);
      setUpdateBlogs(updateBlogs + 1);
      setConfirmationMessage(
        `a new blog: ${blog.title} by ${blog.author} was added.`,
      );
      setTimeout(() => {
        setConfirmationMessage(null);
      }, 5000);
    } catch (exc) {
      setErrorMessage(exc.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const showBlogs = () => {
    if (user !== null) {
      return (
        <Togglable buttonLabel={"new blog"} ref={newBlogRef}>
          <NewBlog createBlog={addNewBlog} />
        </Togglable>
      );
    }
  };

  return (
    <div>
      <LoginForm
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        setUsername={setUsername}
        setPassword={setPassword}
        user={user}
        username={username}
        password={password}
      />

      <Notification
        errorMessage={errorMessage}
        confirmationMessage={confirmationMessage}
      />

      {showBlogs()}

      <Blogs
        user={user}
        handleLogout={handleLogout}
        blogs={blogs}
        reloadBlogs={reloadBlogs}
        addLike={addLike}
      />
    </div>
  );
};

export default App;
