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
import { useUserDispatch, useUserValue } from "./components/UserContext";
import { Route, Routes } from "react-router-dom";
import Users from "./components/Users";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const newBlogRef = useRef();

  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();
  const userDispatch = useUserDispatch();
  const user = useUserValue();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "LOGIN", payload: user });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      userDispatch({ type: "LOGIN", payload: user });
      setUsername("");
      setPassword("");
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
    userDispatch({ type: "LOGOUT", payload: null });
  };

  const likeBlogMutation = useMutation({
    mutationFn: blogService.updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const addLike = async (newBlogObject) => {
    await likeBlogMutation.mutateAsync(newBlogObject);
  };

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
    <div className="container">
      <LoginForm
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        setUsername={setUsername}
        setPassword={setPassword}
        username={username}
        password={password}
      />
      <Notification />
      <Routes>
        <Route path="/users/*" element={<Users userToRender={null} />} />
        <Route
          path="/"
          element={
            <div>
              {showBlogs()}
              <Blogs
                handleLogout={handleLogout}
                blogs={blogs}
                addLike={addLike}
              />
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
