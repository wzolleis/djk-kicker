import { Outlet } from "@remix-run/react";

const Dashboard = () => {
  return (
    <div className="h-full min-h-screen">
      <Outlet></Outlet>
    </div>
  );
};

export default Dashboard;
