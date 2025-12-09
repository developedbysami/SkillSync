import React from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter"; // Import your store
import { LogOut, User, LogIn } from "lucide-react"; // Icons

const Navbar = () => {
  const { auth } = usePuterStore();

  return (
    <div className="sticky top-4 z-50 w-full flex justify-center px-4">
      {/* The Glass Navbar */}
      <nav className="navbar">
        {/* LOGO */}
        <Link to={"/"} className="hover:opacity-80 transition-opacity">
          <p className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Skill<span className="text-indigo-400">Sync</span>
          </p>
        </Link>

        {/* AUTH ACTIONS */}
        <div className="flex items-center gap-4">
          {auth.isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-800/50 py-1.5 px-3 border border-slate-700/50">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-slate-300">
                  {auth.user?.username || "User"}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={auth.signOut}
                className="group flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/20 transition-all hover:bg-red-500 hover:text-white hover:border-red-500"
                title="Sign Out"
              >
                <span className="hidden sm:block">Log Out</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={auth.signIn}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Log In
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
