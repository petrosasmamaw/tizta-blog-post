import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchBlogById, fetchComments, addComment } from "../slice/blogSlice";

export default function MyBlog() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedBlog, comments } = useSelector((state) => state.blog);
  const [newComment, setNewComment ] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  const handleComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    dispatch(addComment({ blogId: id, newComment }));
    setNewComment("");
  };

  if (!selectedBlog) return <p>Loading..</p>;

  return (
    <div className="myblog-container">
      <h1>user {selectedBlog.username}</h1>
      <p>{selectedBlog.description} .</p>
      {selectedBlog.image && (
        <img
          src={Array.isArray(selectedBlog.image) ? selectedBlog.image[0].url : selectedBlog.image}
          alt="Blog"
        />
      )}
      <h3>Comments</h3>
      <pre>{comments || "No comments yet."}</pre>
      <form onSubmit={handleComment}>
        <textarea
          placeholder="Add a comment here
"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit">Add Comment.</button>
      </form>
    </div>
  );
}
