import { Outlet } from "@remix-run/react";

const Admin = () => {
  return (
    <>
      <div>Admin!!!</div>
      <Outlet/>
    </>
  );
};

export default Admin;