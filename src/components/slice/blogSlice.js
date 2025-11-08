import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = "blog";
const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// Helper to map Airtable records
const mapAirtableRecords = (records) =>
  records.map((record) => ({
    id: record.id,
    ...record.fields,
  }));

// Fetch all blogs
export const fetchBlogs = createAsyncThunk("blog/fetchBlogs", async () => {
  const response = await axios.get(AIRTABLE_URL, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  return mapAirtableRecords(response.data.records);
});

// Fetch blogs by userId
export const fetchBlogsByUserId = createAsyncThunk(
  "blog/fetchBlogsByUserId",
  async (userId) => {
    const filter = encodeURIComponent(`{userId}='${userId}'`);
    const response = await axios.get(`${AIRTABLE_URL}?filterByFormula=${filter}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    return mapAirtableRecords(response.data.records);
  }
);

// Fetch single blog by ID
export const fetchBlogById = createAsyncThunk("blog/fetchBlogById", async (id) => {
  const response = await axios.get(`${AIRTABLE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const record = response.data;
  return { id: record.id, ...record.fields };
});

// Add new blog post
export const addBlog = createAsyncThunk("blog/addBlog", async (newBlog) => {
  const response = await axios.post(
    AIRTABLE_URL,
    { fields: newBlog },
    { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
  );
  const record = response.data;
  return { id: record.id, ...record.fields };
});

// Add comment to an existing blog
export const addComment = createAsyncThunk(
  "blog/addComment",
  async ({ blogId, newComment }) => {
    // Fetch current blog
    const blogResponse = await axios.get(`${AIRTABLE_URL}/${blogId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const existingComments = blogResponse.data.fields.comment || "";
    const updatedComments = existingComments
      ? `${existingComments}\n${newComment}`
      : newComment;

    const updateResponse = await axios.patch(
      `${AIRTABLE_URL}/${blogId}`,
      { fields: { comment: updatedComments } },
      { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
    );

    return { id: updateResponse.data.id, ...updateResponse.data.fields };
  }
);

// Fetch comments only
export const fetchComments = createAsyncThunk("blog/fetchComments", async (blogId) => {
  const response = await axios.get(`${AIRTABLE_URL}/${blogId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  return { id: response.data.id, comments: response.data.fields.comment || "" };
});

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    selectedBlog: null,
    comments: "",
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => { state.status = "loading"; })
      .addCase(fetchBlogs.fulfilled, (state, action) => { state.status = "succeeded"; state.blogs = action.payload; })
      .addCase(fetchBlogs.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })

      .addCase(fetchBlogsByUserId.pending, (state) => { state.status = "loading"; })
      .addCase(fetchBlogsByUserId.fulfilled, (state, action) => { state.status = "succeeded"; state.blogs = action.payload; })
      .addCase(fetchBlogsByUserId.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })

      .addCase(fetchBlogById.pending, (state) => { state.status = "loading"; state.selectedBlog = null; })
      .addCase(fetchBlogById.fulfilled, (state, action) => { state.status = "succeeded"; state.selectedBlog = action.payload; })
      .addCase(fetchBlogById.rejected, (state, action) => { state.status = "failed"; state.error = action.error.message; })

      .addCase(addBlog.fulfilled, (state, action) => { state.blogs.push(action.payload); })

      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) state.blogs[index] = action.payload;
        if (state.selectedBlog && state.selectedBlog.id === action.payload.id) {
          state.selectedBlog = action.payload;
        }
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload.comments;
      });
  },
});

export const selectAllBlogs = (state) => state.blog.blogs;
export const selectSelectedBlog = (state) => state.blog.selectedBlog;
export const selectBlogComments = (state) => state.blog.comments;
export const getBlogStatus = (state) => state.blog.status;
export const getBlogError = (state) => state.blog.error;

export default blogSlice.reducer;
