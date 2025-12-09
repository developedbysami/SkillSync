import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };

    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      // CHANGES:
      // 1. rounded-2xl (bigger corners)
      // 2. border-slate-700/50 (lighter border)
      // 3. bg-slate-800/40 (lighter, more glass-like background)
      // 4. Added shadow-lg for depth
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-800/60 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2"
    >
      {/* HEADER SECTION - Increased padding (p-6) and gap */}
      <div className="flex items-start justify-between gap-5 p-6">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          {/* Increased font size to text-xl */}
          {companyName ? (
            <h2 className="truncate text-xl font-bold !text-white group-hover:text-indigo-400 transition-colors">
              {companyName}
            </h2>
          ) : (
            <h2 className="text-xl font-bold text-white">Resume</h2>
          )}
          
          {/* Increased font size to text-base (was sm) */}
          {jobTitle ? (
            <h3 className="truncate text-base font-medium text-white">
              {jobTitle}
            </h3>
          ) : (
             <h3 className="text-base font-medium text-slate-400">No Job Title</h3>
          )}
        </div>

        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {/* IMAGE PREVIEW SECTION - Increased height and opacity */}
      {resumeUrl ? (
        // Changed height from h-[250px] to h-[300px]
        <div className="relative mt-auto h-[300px] w-full overflow-hidden border-t border-slate-700/50 bg-slate-900/50">
          {/* The Image - Changed opacity-60 to opacity-80 (brighter) */}
          <img
            src={resumeUrl}
            alt="resume preview"
            className="h-full w-full object-cover object-top opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
          
          {/* Lighter Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
        </div>
      ) : (
        // Fallback
        <div className="flex h-[300px] w-full items-center justify-center bg-slate-900/50 border-t border-slate-700/50">
           <span className="text-sm text-white">Loading Preview...</span>
        </div>
      )}
    </Link>
  );
};
export default ResumeCard;