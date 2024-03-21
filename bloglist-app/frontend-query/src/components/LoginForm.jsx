import { useUserValue } from "./UserContext";
import { Form, Button } from "react-bootstrap";

const LoginForm = ({
  handleLogin,
  handleLogout,
  setUsername,
  setPassword,
  username,
  password,
}) => {
  const user = useUserValue();
  if (user === null) {
    return (
      <>
        <h1>Login to see application</h1>
        <Form onSubmit={handleLogin} id="loginForm">
          <Form.Group>
            <Form.Label>username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              id="username"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              id="password"
            />
          </Form.Group>
          <br></br>
          <Button variant="primary" type="submit" id="login-button">
            login
          </Button>
        </Form>
      </>
    );
  } else {
    return (
      <div>
        <h1>{user.name} is logged in</h1>
        <form onSubmit={handleLogout}>
          <Button variant="primary" type="submit" id="logout-button">
            logout
          </Button>
        </form>
      </div>
    );
  }
};

export default LoginForm;
