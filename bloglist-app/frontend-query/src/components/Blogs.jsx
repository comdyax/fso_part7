import Blog from "./Blog";
import { useUserValue } from "./UserContext";

const Blogs = (props) => {
  const user = useUserValue();
  if (user !== null) {
    return (
      <div key={user.id} id="blogs">
        <h2>blogs</h2>
        <ul key={user.id}>
          {props.blogs.map((blog) => (
            <li key={blog.id}>
              <Blog blog={blog} user={user} addLike={props.addLike} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default Blogs;
