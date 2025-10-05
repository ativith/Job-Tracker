import {
  AiOutlineDashboard,
  AiOutlineCalendar,
  AiOutlineProfile,
} from "react-icons/ai"; // ✅ เพิ่ม import ไอคอน
import { FaRegFileAlt, FaRegCheckCircle } from "react-icons/fa"; // ✅ เพิ่ม import ไอคอน
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NavItem from "../components/navItem";

interface Props {
  children: React.ReactNode;
}

function MainLayOut({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // ✅ สร้าง array ของ navItems พร้อม icon และ path
  const navItems = [
    { label: "Dashboard", icon: <AiOutlineDashboard />, path: "/dashboard" },
    { label: "Applications", icon: <FaRegFileAlt />, path: "/applications" },
    { label: "Schedule", icon: <FaRegCheckCircle />, path: "/statusjobs" },
    { label: "Calendar", icon: <AiOutlineCalendar />, path: "/calendar" },
    {
      label: "Profile / Settings",
      icon: <AiOutlineProfile />,
      path: "/profile",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-indigo-950 p-5 flex items-center relative z-50">
        <button
          className="md:hidden text-white text-2xl mr-6"
          onClick={toggleSidebar}
        >
          {!isSidebarOpen && <AiOutlineDashboard />}{" "}
        </button>
        <h1 className="text-indigo-50 font-bold text-2xl">Job Tracker</h1>{" "}
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar Desktop */}
        <aside className="w-[20%] h-full hidden md:block mt-4">
          <nav className="flex flex-col gap-4 h-full">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                onClick={() => navigate(item.path)}
                active={window.location.pathname === item.path}
              >
                {/* ✅ เพิ่มไอคอนและจัด layout flex */}
                <div className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition">
                  <span className="text-xl">{item.icon}</span>{" "}
                  {/* ✅ เพิ่มไอคอน */}
                  <span className="font-medium">{item.label}</span>{" "}
                  {/* ✅ เพิ่ม font-medium */}
                </div>
              </NavItem>
            ))}
          </nav>
        </aside>

        {/* Sidebar Mobile */}
        {isSidebarOpen && (
          <aside className="fixed right-0 bottom-0 left-0 top-0 z-50 w-[60%] max-w-xs bg-white shadow-lg p-4 md:hidden animate-slide-in">
            <nav className="flex flex-col gap-4">
              <button
                onClick={toggleSidebar}
                className="text-2xl text-gray-600 self-end"
              >
                <MdCancel />
              </button>
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  active={window.location.pathname === item.path}
                >
                  {/* ✅ เพิ่มไอคอนและ layout flex เช่นเดียวกับ desktop */}
                  <div className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                </NavItem>
              ))}
            </nav>
          </aside>
        )}

        {/* Overlay Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}

export default MainLayOut;
