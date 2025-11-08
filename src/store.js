import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./components/slice/blogSlice";

const store = configureStore({
  reducer: {
    blog: blogReducer
  }
});

export default store;
