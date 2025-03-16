"use client";
import { useState } from 'react';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Mobile menu toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-4 text-white bg-gray-900 fixed top-4 left-4 rounded z-50"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 min-h-screen bg-gray-900 text-white p-5 fixed md:relative md:w-64 shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <h2 className="text-xl font-bold text-center mb-5">Admin Panel</h2>
        <ul className="space-y-3">
          <li>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition duration-300 focus:outline-none"
            >
              Manage Users ▼
            </button>
            <ul className="space-y-2 ml-4">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded transition duration-300">
                  Teachers
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded transition duration-300">
                  Students
                </a>
              </li>
            </ul>
          </li>
          <li>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition duration-300 focus:outline-none"
            >
              Performance ▼
            </button>
            <ul className="space-y-2 ml-4">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded transition duration-300">
                  Class Performance
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded transition duration-300">
                  Individual Performance
                </a>
              </li>
            </ul>
          </li>
          <li>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition duration-300 focus:outline-none"
            >
              Classroom ▼
            </button>
            <ul className="space-y-2 ml-4">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded transition duration-300">
                  Stream
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-700 rounded transition duration-300">
                  Class
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 md:ml-64">
        <div className="flex flex-col md:flex-row justify-between items-center mb-5">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <a
            href="#"
            className="mt-3 md:mt-0 bg-red-600 text-white font-bold text-lg flex items-center gap-2 px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300"
          >
            <span>Logout</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6-10h5a2 2 0 012 2v16a2 2 0 01-2 2h-5"
              />
            </svg>
          </a>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
            <h3 className="text-lg font-semibold text-gray-700">Total Streams</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
            <h3 className="text-lg font-semibold text-gray-700">Total Teachers</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
            <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
