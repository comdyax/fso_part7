import userService from "../services/users";
import { useQuery } from "@tanstack/react-query";
import Table from "react-bootstrap/Table";
import { Link, Route, Routes } from "react-router-dom";
import { useMatch } from "react-router-dom";
import DetailUser from "./DetailUser";

const UserTable = ({ users }) => {
  return (
    <>
      <h1>Users</h1>
      <Table striped>
        <thead>
          <tr>
            <th>username</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.username}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

const Users = () => {
  const match = useMatch("users/:id");

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    retry: 1,
  });

  if (isPending) {
    return <div>loading data...</div>;
  }

  if (isError) {
    console.log(error.message);
    return <div>users service not available due to problems with server</div>;
  }

  const users = data;
  let userToRender = null;
  if (match) {
    userToRender = users.find((user) => user.id === match.params.id);
  }

  return (
    <>
      <Routes>
        <Route
          path="/:id"
          element={<DetailUser userToRender={userToRender} />}
        />
        <Route path="/" element={<UserTable users={users} />} />
      </Routes>
    </>
  );
};

export default Users;
