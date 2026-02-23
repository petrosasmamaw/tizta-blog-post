import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBlog } from "../slice/blogSlice";

export default function AddBlog({ userId }) {
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) return alert("You must be logged in to post a blog! .");

    dispatch(
      addBlog({
        userId, // Use logged-in user's ID
        username,
        description,
        image: image ? [{ url: image }] : [],
        comment,
      })
    );

    setUsername("");
    setDescription("");
    setImage("");
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Create New Blogs Share your blog here..</h2>
      <input
        type="text"
        placeholder="enter Your Name here ."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <textarea
        placeholder="Write your description here"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <input
        type="text"
        placeholder="Initial Comments (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit">Post Blog.</button>
    </form>
  );
}
