"use client";
import Navbar from "@/components/seller/Navbar";
import Sidebar from "@/components/seller/Sidebar";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiIndeed } from "react-icons/si";

const Layout = ({ children }) => {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <footer className="border-t border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 text-sm text-gray-500 gap-2">
          <p>
            Developed and Designed by{" "}
            <span className="text-gray-900 font-medium">Leo Duong</span>
          </p>
          <p className="text-xs">&copy; {year} LD</p>
          <div className="flex items-center gap-3">
            <a href="https://github.com/LeoDuong28" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400 transition-all">
              <FaGithub size={14} />
            </a>
            <a href="https://www.linkedin.com/in/leo-duong-836334280" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400 transition-all">
              <FaLinkedin size={14} />
            </a>
            <a href="https://profile.indeed.com/p/leod-wp087hl" aria-label="Indeed" target="_blank" rel="noopener noreferrer" className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400 transition-all">
              <SiIndeed size={14} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
