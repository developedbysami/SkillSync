import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

interface Resume {
  id: string;
  companyName: string;
  jobTitle: string;
  feedback: { overallScore: number };
  imagePath: string;
}

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      try {
        const blob = await fs.read(imagePath);
        if (!blob) return;
        let url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch (e) {
        console.error("Error loading resume preview", e);
      }
    };

    loadResume();
  }, [imagePath, fs]);

  return (
    <Link
      to={`/resume/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2"
    >
      {/* HEADER SECTION */}
      <div className="flex items-start justify-between gap-5 p-6">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          {companyName ? (
            <h2 className="truncate text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {companyName}
            </h2>
          ) : (
            <h2 className="text-xl font-bold text-slate-900">Resume</h2>
          )}

          {jobTitle ? (
            <h3 className="truncate text-base font-medium text-slate-500 group-hover:text-slate-700">
              {jobTitle}
            </h3>
          ) : (
            <h3 className="text-base font-medium text-slate-400">
              No Job Title
            </h3>
          )}
        </div>

        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {/* IMAGE PREVIEW SECTION */}
      {resumeUrl ? (
        <div className="relative mt-auto h-[300px] w-full overflow-hidden border-t border-slate-100 bg-slate-50">
          <img
            src={resumeUrl}
            alt="resume preview"
            className="h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      ) : (
        <div className="flex h-[300px] w-full items-center justify-center bg-slate-50 border-t border-slate-100">
          <span className="text-sm text-slate-400 animate-pulse">
            Loading Preview...
          </span>
        </div>
      )}
    </Link>
  );
};
export default ResumeCard;
