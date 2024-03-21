const DetailUser = ({ userToRender }) => {
  return (
    <>
      <h2>{userToRender.username}</h2>
      <ul>
        {userToRender.blogs.map((blog) => {
          return (
            <li key={blog.id}>
              <b>{blog.title}</b>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default DetailUser;
