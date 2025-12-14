import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Plus, FileText, ArrowRight } from "lucide-react";

interface Resume {
  id: string;
  [key: string]: any;
}

interface KVItem {
  value: string;
}

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
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const resumeList = (await kv.list("resume:*", true)) as KVItem[];
        const parsedResumes = resumeList?.map(
          (resume) => JSON.parse(resume.value) as Resume
        );
        setResumes(parsedResumes || []);
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        setLoadingResumes(false);
      }
    };
    loadResumes();
  }, [kv]);

  return (
    <main className="relative min-h-screen w-full bg-white text-slate-900 font-sans selection:bg-indigo-100">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <section className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* HERO */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-600 sm:text-5xl md:text-6xl">
              Resume <span className="text-indigo-600">Performance Hub</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
              Track your optimization history and unlock professional insights.
            </p>
          </div>

          {/* LOADING */}
          {loadingResumes && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative h-24 w-24 rounded-full border border-indigo-100 bg-indigo-50 p-4">
                <img
                  src="/images/resume-scan-2.gif"
                  className="h-full w-full object-cover opacity-90 rounded-full"
                  alt="Scanning..."
                />
              </div>
              <p className="mt-6 text-lg font-medium text-slate-700 animate-pulse">
                Syncing your documents...
              </p>
            </div>
          )}

          {!loadingResumes && resumes?.length === 0 && (
            <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200">
                <FileText className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No resumes analyzed yet
              </h3>
              <p className="mt-2 text-slate-600">
                Upload your first resume to get an instant ATS score.
              </p>
              <div className="mt-8">
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md active:scale-95"
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
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Recent Scans
                </h2>
                <Link
                  to="/upload"
                  className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
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
                  className="group relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-500 transition-all hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 min-h-[400px]"
                >
                  <div className="rounded-full bg-slate-100 p-6 transition-transform group-hover:scale-110 group-hover:bg-white group-hover:shadow-md">
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
