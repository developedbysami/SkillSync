import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Plus, FileText, ArrowRight } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SkillSync" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 z-0 pointer-events-none" />
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
          backgroundSize: "4rem 4rem",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <section className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* HERO */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-lg">
              Resume{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Performance Hub
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
              Track your optimization history and unlock AI-driven insights.
            </p>
          </div>

          {/* LOADING */}
          {loadingResumes && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative h-24 w-24 rounded-full border border-indigo-500/30 bg-indigo-500/5 p-4 backdrop-blur-sm">
                <img
                  src="/images/resume-scan-2.gif"
                  className="h-full w-full object-cover opacity-80 mix-blend-screen rounded-full"
                  alt="Scanning..."
                />
              </div>
              <p className="mt-6 text-lg font-medium text-indigo-300 animate-pulse">
                Syncing your documents...
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loadingResumes && resumes?.length === 0 && (
            <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">
                No resumes analyzed yet
              </h3>
              <p className="mt-2 text-slate-400">
                Upload your first resume to get an instant ATS score.
              </p>
              <div className="mt-8">
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white hover:bg-indigo-500 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  Upload Resume
                </Link>
              </div>
            </div>
          )}

          {/* GRID LAYOUT */}
          {!loadingResumes && resumes.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-white">
                  Recent Scans
                </h2>
                <Link
                  to="/upload"
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Analyze New <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} />
                ))}

                <Link
                  to="/upload"
                  className="group relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-slate-700/50 bg-slate-800/20 text-slate-400 transition-all hover:border-indigo-500/50 hover:bg-slate-800/40 hover:text-indigo-400 min-h-[400px]"
                >
                  <div className="rounded-full bg-slate-800/80 p-6 transition-transform group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 shadow-lg">
                    <Plus className="h-12 w-12" />
                  </div>
                  <span className="font-bold text-xl tracking-wide">
                    Upload New Resume
                  </span>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
