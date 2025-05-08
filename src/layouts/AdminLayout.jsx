import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AdminHeader from "../components/admin/AdminHeader";
import AdminFooter from "../components/admin/AdminFooter";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // vérification du rôle admin
  if (!isAdmin()) {
    navigate("/login");
    return null;
  }

  return (
    <div className="user-layout">
      <AdminHeader />
      <div className="user-content">
        <main id="main-content" className="user-main">
          <Outlet />
        </main>
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;