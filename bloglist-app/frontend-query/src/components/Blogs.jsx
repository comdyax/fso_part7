import Blog from "./Blog";
import { useUserValue } from "./UserContext";

const Blogs = (props) => {
  const user = useUserValue();
  if (user !== null) {
    return (
      <div key={user.id} id="blogs">
        <h2>blogs</h2>
        <div key={user.id}>
          {props.blogs.map((blog) => (
            <div key={blog.id}>
              <Blog blog={blog} user={user} addLike={props.addLike} />
              <br></br>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Blogs;
