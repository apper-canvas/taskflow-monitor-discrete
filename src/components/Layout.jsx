import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Outlet />
    </div>
  );
}