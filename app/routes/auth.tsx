import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "SkillSync | Auth" },
  { name: "description", content: "Log into your account" },
];

const auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next || "/");
  }, [auth.isAuthenticated, next, navigate]);

  return (
    <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center font-sans selection:bg-indigo-100">
      <div className="w-full max-w-md px-4">
        <section className="flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/50">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome
            </h1>

            <h2 className="text-lg font-medium text-slate-500">
              Log In to Continue Your Job Journey
            </h2>
          </div>

          <div className="w-full">
            {isLoading ? (
              <button
                disabled
                className="w-full rounded-lg bg-indigo-50 py-3.5 text-base font-bold text-indigo-400 animate-pulse cursor-not-allowed border border-indigo-100"
              >
                Signing you in...
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button
                    className="w-full rounded-lg bg-red-50 border border-red-100 py-3.5 text-base font-bold text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                    onClick={auth.signOut}
                  >
                    Log Out
                  </button>
                ) : (
                  <button
                    className="w-full rounded-lg bg-indigo-600 py-3.5 text-base font-bold text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all duration-200"
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
