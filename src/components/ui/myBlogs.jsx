import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogsByUserId } from "../slice/blogSlice";
import { Link } from "react-router-dom";

export default function MyBlogs({ userId }) {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blog.blogs);
  const status = useSelector((state) => state.blog.status);

  useEffect(() => {
    if (userId) dispatch(fetchBlogsByUserId(userId));
  }, [dispatch, userId]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      <h2>My Blogs</h2>
      {blogs.length === 0 && <p>No blogs yet.you have to create blog</p>}
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <h3>{blog.username}</h3>
            <p>{blog.description.slice(0, 100)}...</p>
            <Link to={`/myblogs/${blog.id}`}>View Detail</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
