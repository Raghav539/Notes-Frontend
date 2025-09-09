import React from "react";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = ({ searchText, handelSearchText, onLogout, user }) => {
  
  const handleLogout = () => {
    onLogout();
  };
  return (
    <>
      <NavBar
        searchText={searchText}
        handelSearchText={handelSearchText}
        handleLogout={handleLogout}
        user={user}
      />
      <ToastContainer />
      <Outlet />
    </>
  );
};

export default MainLayout;
