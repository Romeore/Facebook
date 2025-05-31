import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import HomeView from "./views/HomeView";
import FeedView from "./views/FeedView";
import PostsView from "./views/PostsView";
import GroupsView from "./views/GroupsView";
import CreatePostView from "./views/CreatePostView";
import StatsView from "./views/StatsView";
import StocksView from "./views/StocksView";
import Navbar from "./components/NavBar";
import './App.css';

const ProtectedRoute = ({ children, setUser }) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.displayName) {
      setUser(currentUser.displayName);
    }
  }, [currentUser, setUser]);

  return currentUser ? children : <Navigate to="/signin" />;
};

function App() {
  const [user, setUser] = useState("No Username");

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar user={user} />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute setUser={setUser}>
                <HomeView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute setUser={setUser}>
                <FeedView username={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute setUser={setUser}>
                <PostsView username={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute setUser={setUser}>
                <CreatePostView username={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute setUser={setUser}>
                <GroupsView username={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute setUser={setUser}>
                <StatsView username={user} />
              </ProtectedRoute>
            }
          />
         <Route path="/stocks" element={<StocksView />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
