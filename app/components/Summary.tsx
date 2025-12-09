import ScoreBadge from "./ScoreBadge";
import ScoreGauge from "./ScoreGauge";

const getScoreTheme = (score: number) => {
  if (score > 70)
    return {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      bar: "bg-emerald-400",
    };
  if (score > 49)
    return {
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      bar: "bg-amber-400",
    };
  return {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    bar: "bg-rose-400",
  };
};

const Category = ({ title, score }: { title: string; score: number }) => {
  const theme = getScoreTheme(score);

  return (
    // CARD CONTAINER
    <div
      className={`flex flex-col justify-between h-full rounded-xl border p-5 transition-all hover:bg-slate-800/40 ${theme.border} ${theme.bg}`}
    >
      {/* TOP ROW: Title and Badge */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-base font-semibold text-slate-200 tracking-wide">
          {title}
        </p>
        {/* We wrap ScoreBadge to ensure it doesn't shrink/squash */}
        <div className="shrink-0">
          <ScoreBadge score={score} />
        </div>
      </div>

      {/* BOTTOM ROW: Big Score and Progress Bar */}
      <div className="mt-auto">
        <div className="flex items-baseline gap-1 mb-3">
          <span className={`text-4xl font-bold ${theme.text}`}>{score}</span>
          <span className="text-sm font-medium text-slate-500">/100</span>
        </div>

        {/* Progress Bar Container */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
          {/* The colored bar itself */}
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
    <div className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-700/50 p-8 bg-slate-900/40">
        <div className="relative shrink-0">
          <ScoreGauge score={feedback.overallScore} />
        </div>

        <div className="flex flex-col gap-3 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-white">
            Your Resume Score
          </h2>
          <p className="max-w-xl text-base text-slate-400 leading-relaxed">
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
