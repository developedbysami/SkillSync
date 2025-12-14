import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = score / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Determine colors based on score
  const getGradientColors = (s: number) => {
    if (s > 70) return { start: "#34d399", end: "#059669" };
    if (s > 49) return { start: "#fbbf24", end: "#d97706" };
    return { start: "#fb7185", end: "#e11d48" };
  };

  const { start, end } = getGradientColors(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-20">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={start} />
              <stop offset="100%" stopColor={end} />
            </linearGradient>
          </defs>

          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
            strokeLinecap="round"
          />

          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-slate-900 text-2xl font-bold pt-4">
            {score}/100
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
