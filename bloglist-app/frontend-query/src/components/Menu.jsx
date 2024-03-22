import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useUserValue } from "./UserContext";

const Menu = ({ handleLogout }) => {
  const padding = {
    padding: 5,
  };

  const user = useUserValue();

  const showLoginUser = () => {
    if (user !== null) {
      return (
        <>
          &emsp;
          {user.username} is logged in &emsp;
          <Button
            onClick={handleLogout}
            variant="primary"
            id="logout-button"
            type="button"
            size="sm"
          >
            logout
          </Button>
        </>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div style={{ backgroundColor: "#ccff66", padding: "5px" }}>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
      {showLoginUser()}
    </div>
  );
};

export default Menu;
