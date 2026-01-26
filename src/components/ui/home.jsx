import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../slice/blogSlice";
import { Link } from "react-router-dom";

export default function Home({user}) {
  const dispatch = useDispatch();
  const { blogs, status } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;

  return (<>
      {!user && <p>Please first log  and view blogs and create post.</p>}
      {user && 
      <div className="home-container">
        <h1>All Blog Posts</h1>
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-card">
            <h2>{blog.username}</h2>
          <p>{blog.description}</p>
          {blog.image && blog.image[0]?.url && (
            <img src={blog.image[0].url} alt="Blog" />
          )}
          <Link to={`/myblogs/${blog.id}`}>View Detail</Link>
        </div>
      ))}
    </div>}</>
  );
}
