import React from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { LogOut, User, LogIn } from "lucide-react";

const Navbar = () => {
  const { auth } = usePuterStore();

  return (
    <div className="sticky top-4 z-50 w-full flex justify-center px-4">
      <nav className="navbar">
        {/* LOGO */}
        <Link
          to={"/"}
          className="hover:opacity-80 transition-opacity cursor-pointer py-2"
        >
          <p className="font-poppins text-2xl font-bold text-slate-900 tracking-tight flex items-center ">
            Skill<span className="text-indigo-600">Sync</span>
          </p>
        </Link>

        {/* AUTH ACTIONS */}
        <div className="flex items-center gap-4">
          {auth.isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 py-1.5 px-3 border border-slate-200">
                <User className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">
                  {auth.user?.username || "User"}
                </span>
              </div>

              <button
                onClick={auth.signOut}
                className="group flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 border border-red-100 transition-all hover:bg-red-600 hover:text-white hover:border-red-600 cursor-pointer"
                title="Sign Out"
              >
                <span className="hidden sm:block">Log Out</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={auth.signIn}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
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
