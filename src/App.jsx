import React, { useState, useEffect } from "react";
import { supabase } from "./supabase.js";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/navbar.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Home from "./components/ui/home.jsx";
import MyBlog from "./components/ui/myBlog.jsx";
import MyBlogs from "./components/ui/myBlogs.jsx";
import AddBlog from "./components/ui/addBlog.jsx";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/myblogs" element={<MyBlogs userId={user?.id} />} />
        <Route path="/myblogs/:id" element={<MyBlog />} />
        <Route path="/addblog" element={<AddBlog  userId={user?.id}/>} />
      </Routes>
    </div>
  );
};

export default App;
