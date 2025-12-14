import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const getScoreTheme = (score: number) => {
  if (score > 69)
    return {
      border: "border-emerald-200",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      titleColor: "text-emerald-700",
      badgeBg: "bg-emerald-100 text-emerald-800",
      cardBorder: "border-emerald-500",
      iconContainer: "bg-emerald-100 text-emerald-600",
    };
  if (score > 49)
    return {
      border: "border-amber-200",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      titleColor: "text-amber-700",
      badgeBg: "bg-amber-100 text-amber-800",
      cardBorder: "border-amber-500",
      iconContainer: "bg-amber-100 text-amber-600",
    };
  return {
    border: "border-rose-200",
    iconColor: "text-rose-600",
    iconBg: "bg-rose-100",
    titleColor: "text-rose-700",
    badgeBg: "bg-rose-100 text-rose-800",
    cardBorder: "border-rose-500",
    iconContainer: "bg-rose-100 text-rose-600",
  };
};

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const theme = getScoreTheme(score);

  // Determine subtitle based on score
  const subtitle =
    score > 69 ? "Great Job!" : score > 49 ? "Good Start" : "Needs Improvement";

  return (
    <div
      className={`w-full rounded-2xl border bg-white p-6 shadow-xl shadow-slate-200/50 ${theme.border}`}
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          {/* Dynamic Score Icon Wrapper */}
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full ${theme.iconBg} ${theme.iconColor}`}
          >
            {score > 69 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">ATS Score</h2>
            <div
              className={`text-sm sm:text-lg mt-1 inline-flex items-center rounded px-2.5 py-0.5 font-medium ${theme.badgeBg}`}
            >
              {score} / 100
            </div>
          </div>
        </div>

        {/* Right side status text */}
        <div className="text-left sm:text-right">
          <h3 className={`text-xl font-bold ${theme.titleColor}`}>
            {subtitle}
          </h3>
          <p className="text-sm sm:text-lg text-slate-500">ATS Compatibility</p>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div>
        <p className="text-sm sm:text-lg text-slate-600 mb-6 leading-relaxed">
          This score represents how well your resume is likely to perform in
          Applicant Tracking Systems used by employers.
        </p>

        {/* SUGGESTIONS LIST */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-white hover:shadow-sm ${
                suggestion.type === "good"
                  ? "border-l-4 border-l-emerald-500"
                  : "border-l-4 border-l-amber-500"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {suggestion.type === "good" ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-sm sm:text-lg text-slate-700 leading-snug">
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <p className="text-sm sm:text-lg text-slate-500 italic">
          Keep refining your resume to improve your chances of getting past ATS
          filters and into the hands of recruiters.
        </p>
      </div>
    </div>
  );
};

export default ATS;
