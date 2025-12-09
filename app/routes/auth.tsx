import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

const auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center font-sans">
      {/* ---CARD CONTAINER--- */}
      <div className="w-full max-w-md px-4">
        <section className="flex flex-col gap-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-10 backdrop-blur-xl shadow-2xl">
          {/* ---HEADINGS--- */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Welcome
            </h1>
            <h2 className="text-lg font-medium text-slate-400">
              Log In to Continue Your Job Journey
            </h2>
          </div>

          {/* ---ACTION BUTTONS--- */}
          <div className="w-full">
            {isLoading ? (
              <button
                disabled
                className="w-full rounded-lg bg-indigo-600/50 py-3.5 text-base font-bold text-indigo-200 animate-pulse cursor-not-allowed"
              >
                Signing you in...
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button
                    className="w-full rounded-lg bg-red-500/10 border border-red-500/50 py-3.5 text-base font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
                    onClick={auth.signOut}
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    className="w-full rounded-lg bg-indigo-600 py-3.5 text-base font-bold text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all duration-200"
                    onClick={auth.signIn}
                  >
                    Log In
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default auth;
