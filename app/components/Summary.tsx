import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";

const getScoreTheme = (score: number) => {
  if (score > 70)
    return {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      bar: "bg-emerald-500",
    };
  if (score > 49)
    return {
      // Amber
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      bar: "bg-amber-500",
    };
  return {
    // Rose
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    bar: "bg-rose-500",
  };
};

const Category = ({ title, score }: { title: string; score: number }) => {
  const theme = getScoreTheme(score);

  return (
    // CARD CONTAINER
    <div
      className={`flex flex-col justify-between h-full rounded-xl border p-5 transition-all hover:shadow-md ${theme.border} ${theme.bg}`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-base font-semibold text-slate-700 tracking-wide">
          {title}
        </p>
        <div className="shrink-0">
          <ScoreBadge score={score} />
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1 mb-3">
          <span className={`text-4xl font-bold ${theme.text}`}>{score}</span>
          <span className="text-sm font-medium text-slate-400">/100</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${theme.bar}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-100 p-8 bg-slate-50/50">
        <div className="relative shrink-0">
          <ScoreGauge score={feedback.overallScore} />
        </div>

        <div className="flex flex-col gap-3 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Your Resume Score
          </h2>

          <p className="max-w-xl text-base text-slate-600 leading-relaxed">
            This score is calculated based on key performance indicators used by
            modern ATS systems. Improve your score to increase interview
            chances.
          </p>
        </div>
      </div>

      {/* CARDS GRID SECTION */}
      <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
        <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
        <Category title="Content" score={feedback.content.score} />
        <Category title="Structure" score={feedback.structure.score} />
        <Category title="Skills" score={feedback.skills.score} />
      </div>
    </div>
  );
};
export default Summary;
