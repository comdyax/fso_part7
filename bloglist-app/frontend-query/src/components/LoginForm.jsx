const LoginForm = ({
  handleLogin,
  handleLogout,
  setUsername,
  setPassword,
  username,
  password,
  user,
}) => {
  if (user === null) {
    return (
      <>
        <h1>Login to see application</h1>
        <form onSubmit={handleLogin} id="loginForm">
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              id="username"
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              id="password"
            />
          </div>
          <button type="submit" id="login-button">
            login
          </button>
        </form>
      </>
    );
  } else {
    return (
      <div>
        <h1>{user.name} is logged in</h1>
        <form onSubmit={handleLogout}>
          <button type="submit" id="logout-button">
            logout
          </button>
        </form>
      </div>
    );
  }
};

export default LoginForm;
