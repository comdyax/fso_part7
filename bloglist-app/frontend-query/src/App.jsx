import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import blogService from "./services/blogs";
import loginService from "./services/login";

import NewBlog from "./components/NewBlog";
import Blogs from "./components/Blogs";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

import { useNotificationDispatch } from "./components/BlogContext";

const App = () => {
  const [updateBlogs, setUpdateBlogs] = useState(0);
  //const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const newBlogRef = useRef();

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

  const dispatch = useNotificationDispatch();

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
      const payload = "wrong username or password";
      dispatch({ type: "ERROR", payload: payload });
      setTimeout(() => {
        dispatch({ type: "REMOVE", payload: payload });
      }, 6000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  const queryClient = useQueryClient();

  const newBlogMutation = useMutation({
    mutationFn: blogService.addBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const addNewBlog = async (newBlogObject) => {
    newBlogRef.current.toggleVisibility();
    try {
      const blog = await newBlogMutation.mutateAsync(newBlogObject);
      const payload = `a new blog: ${blog.title} by ${blog.author} was added.`;
      dispatch({ type: "CONFIRM", payload: payload });
      setTimeout(() => {
        dispatch({ type: "REMOVE", payload: payload });
      }, 6000);
    } catch (exc) {
      const payload = exc.response.data.error;
      dispatch({ type: "ERROR", payload: payload });
      setTimeout(() => {
        dispatch({ type: "REMOVE", payload: payload });
      }, 6000);
    }
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
  });

  if (isPending) {
    return <div>loading data...</div>;
  }

  if (isError) {
    console.log(error.message);
    return <div>blog service not available due to problems with server</div>;
  }

  const blogs = data;

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

      <Notification />

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
