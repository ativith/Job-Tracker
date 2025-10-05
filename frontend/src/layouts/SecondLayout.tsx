import NavItem from "../components/navItem";
import { AiOutlineMenu } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

function SecondLayOut({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          {/* Hamburger button for mobile */}
          <button
            className="md:hidden text-white text-2xl mr-4"
            onClick={toggleSidebar}
          >
            {!isSidebarOpen && <AiOutlineMenu />}
          </button>
          <h1 className="text-white font-bold text-lg md:text-xl">
            Job Tracker
          </h1>
        </div>
        <div className="hidden md:flex gap-4 text-white font-medium">
          <span>Welcome!</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white shadow-lg p-4 border-r border-gray-200">
          <nav className="flex flex-col gap-2">
            <NavItem
              onClick={() => navigate("/dashboard")}
              active={window.location.pathname === "/dashboard"}
            >
              Dashboard
            </NavItem>
            <NavItem
              onClick={() => navigate("/applications")}
              active={window.location.pathname === "/applications"}
            >
              Applications
            </NavItem>
            <NavItem
              onClick={() => navigate("/statusjobs")}
              active={window.location.pathname === "/statusjobs"}
            >
              Schedule
            </NavItem>
            <NavItem
              onClick={() => navigate("/tags")}
              active={window.location.pathname === "/tags"}
            >
              Tags
            </NavItem>
            <NavItem
              onClick={() => navigate("/profile")}
              active={window.location.pathname === "/profile"}
            >
              Profile / Settings
            </NavItem>
            <button
              className="mt-4 w-full text-left px-3 py-2 rounded-md hover:bg-red-100 text-red-600 font-medium"
              onClick={() => alert("Logout triggered")}
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <>
            <aside className="fixed inset-0 z-50 w-64 bg-white shadow-lg p-4 animate-slide-in">
              <button onClick={toggleSidebar} className="text-2xl mb-4">
                <MdCancel />
              </button>
              <nav className="flex flex-col gap-2">
                {[
                  "dashboard",
                  "applications",
                  "statusjobs",
                  "tags",
                  "profile",
                ].map((path) => (
                  <NavItem
                    key={path}
                    onClick={() => {
                      navigate(`/${path}`);
                      setIsSidebarOpen(false);
                    }}
                    active={window.location.pathname === `/${path}`}
                  >
                    {path.charAt(0).toUpperCase() + path.slice(1)}
                  </NavItem>
                ))}
                <button
                  className="mt-4 w-full text-left px-3 py-2 rounded-md hover:bg-red-100 text-red-600 font-medium"
                  onClick={() => {
                    alert("Logout triggered");
                    setIsSidebarOpen(false);
                  }}
                >
                  Logout
                </button>
              </nav>
            </aside>
            <div
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setIsSidebarOpen(false)}
            />
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-md p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SecondLayOut;
