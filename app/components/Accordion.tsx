import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { cn } from "~/lib/utils";

// --- CONTEXT ---
interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
};

// --- MAIN ACCORDION WRAPPER ---
interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
}) => {
  const [activeItems, setActiveItems] = useState<string[]>(
    defaultOpen ? [defaultOpen] : []
  );

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return (
    <AccordionContext.Provider
      value={{ activeItems, toggleItem, isItemActive }}
    >
      <div className={`space-y-3 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  );
};

// --- ACCORDION ITEM (THE CARD) ---
interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  children,
  className = "",
}) => {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-700 bg-slate-900/40 transition-colors hover:border-slate-600 ${className}`}
    >
      {children}
    </div>
  );
};

// --- ACCORDION HEADER (THE TRIGGER) ---
interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right",
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  const handleClick = () => {
    toggleItem(itemId);
  };

  const defaultIcon = (
    <svg
      className={cn(
        "h-5 w-5 text-indigo-400 transition-transform duration-300",
        {
          "rotate-180": isActive,
        }
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  return (
    <button
      onClick={handleClick}
      className={`
                flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left transition-colors duration-200
                focus:outline-none hover:bg-slate-800/50
                ${isActive ? "bg-slate-800/30" : ""}
                ${className}
            `}
    >
      <div className="flex items-center gap-3">
        {iconPosition === "left" && (icon || defaultIcon)}

        <div className="flex-1 text-base font-semibold text-slate-200">
          {children}
        </div>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  );
};

// --- ACCORDION CONTENT (THE BODY) ---
interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemId,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <div
      className={`
                grid transition-[grid-template-rows] duration-300 ease-in-out
                ${isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                ${className}
            `}
    >
      <div className="overflow-hidden">
        <div className="border-t border-slate-700/50 bg-slate-900/20 px-5 py-4 text-slate-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
