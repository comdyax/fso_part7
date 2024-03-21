import userService from "../services/users";
import { useQuery } from "@tanstack/react-query";
import Table from "react-bootstrap/Table";

const User = ({ user }) => {
  return (
    <tr>
      <td></td>
      <td>{user.username}</td>
      <td>{user.blogs.length}</td>
    </tr>
  );
};

const Users = () => {
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

  return (
    <>
      <h1>Users</h1>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>username</th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <User key={user.id} user={user} />
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Users;
