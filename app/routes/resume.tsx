import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { ChevronLeft, FileText, Download, Share2 } from "lucide-react";

export const meta = () => [
  { title: "SkillSync | Review " },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
    };
    loadResume();
  }, [id]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 font-sans text-slate-200">
      {/* --- NAVBAR --- */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md p-4">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT: Back Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="group flex items-center gap-1 rounded-lg p-2 sm:px-3 sm:py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />

              <span className="hidden sm:inline">Back</span>
            </Link>

            {/* ---Separator--- */}
            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <h1 className="!text-sm sm:!text-xl md:!text-2xl lg:!text-3xl font-semibold text-slate-200">
              Analysis Report
            </h1>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 p-2 sm:px-3 sm:py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                title="View PDF"
              >
                <FileText className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline">View PDF</span>
              </a>
            )}

            <button
              className="flex items-center gap-2 rounded-lg bg-indigo-600 p-2 sm:px-3 sm:py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20"
              onClick={() => alert("Share feature coming soon!")}
              title="Share"
            >
              <Share2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 pb-6">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
              Resume Review
            </h2>
            <p className="text-slate-400">
              Here is the detailed breakdown of your resume's performance.
            </p>
          </div>

          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12">
              <div className="relative h-32 w-32 sm:h-48 sm:w-48 overflow-hidden rounded-full border-4 border-slate-800 bg-slate-900 shadow-2xl">
                <img
                  src="/images/resume-scan-2.gif"
                  className="h-full w-full object-cover opacity-80 mix-blend-screen"
                  alt="Analyzing..."
                />
              </div>
              <h3 className="mt-8 text-xl font-medium text-indigo-300 animate-pulse text-center">
                Analyzing Resume...
              </h3>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
export default Resume;
