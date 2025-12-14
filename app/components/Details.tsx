import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const getTheme = (scoreOrType: number | string) => {
  // If input is "good" or high score
  if (
    scoreOrType === "good" ||
    (typeof scoreOrType === "number" && scoreOrType > 69)
  ) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: "/icons/check.svg",
      pill: "bg-emerald-100 text-emerald-800",
    };
  }

  if (typeof scoreOrType === "number" && scoreOrType > 39) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: "/icons/warning.svg",
      pill: "bg-amber-100 text-amber-800",
    };
  }
  // Default / "improve" / low score
  return {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: "/icons/warning.svg",
    pill: "bg-rose-100 text-rose-800",
  };
};

const ScoreBadge = ({ score }: { score: number }) => {
  const theme = getTheme(score);
  return (
    <div
      className={cn(
        "flex flex-row gap-2 items-center px-3 py-1 rounded-full border backdrop-blur-sm",
        theme.bg,
        theme.border
      )}
    >
      <div className={theme.text}>
        <img src={theme.icon} alt="score" className="size-4" />
      </div>
      <p className={cn("text-xs sm:text-base font-bold", theme.text)}>
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex w-full flex-row items-center justify-between pr-2">
      <p className="text-lg font-semibold text-slate-800 mr-2">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-slate-50 border border-slate-200 w-full rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => {
          const theme = getTheme(tip.type);
          return (
            <div className="flex flex-row gap-3 items-center" key={index}>
              <div
                className={cn(
                  "mt-1 shrink-0 p-1 rounded-full border",
                  theme.bg,
                  theme.border
                )}
              >
                <img src={theme.icon} alt="icon" className="size-3" />
              </div>
              <p className="text-sm sm:text-lg font-medium text-slate-700 leading-snug">
                {tip.tip}
              </p>
            </div>
          );
        })}
      </div>

      {/* DETAILED CARDS */}
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => {
          const theme = getTheme(tip.type);
          return (
            <div
              key={index + tip.tip}
              className={cn(
                "flex flex-col gap-2 rounded-xl p-5 border transition-colors shadow-sm",

                theme.bg,
                theme.border
              )}
            >
              <div className="flex flex-row gap-3 items-center">
                <div
                  className={cn(
                    "flex items-center justify-center size-8 rounded-full border",

                    theme.bg.replace("50", "100"),
                    theme.border
                  )}
                >
                  <img src={theme.icon} alt="icon" className="size-4" />
                </div>
                <p className={cn("text-base sm:text-lg font-bold", theme.text)}>
                  {tip.tip}
                </p>
              </div>

              <p className="text-sm sm:text-lg text-slate-600 pl-11 leading-relaxed">
                {tip.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion allowMultiple>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
