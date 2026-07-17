import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export interface TourStep {
  targetId: string;
  title?: string;
  description: string;
}

interface GuidedTourProps {
  steps: TourStep[];
  active: boolean;
  onClose: () => void;
}

interface TourPosition {
  target: DOMRect;
  tooltip: { left: number; top: number; width: number };
}

function findVisibleTarget(targetId: string) {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour-id="${targetId}"]`));
  return elements.find((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

function getPosition(target: DOMRect): TourPosition {
  const gap = 16;
  const edge = 12;
  const width = Math.min(340, window.innerWidth - edge * 2);
  const estimatedHeight = 230;
  let left = edge;
  let top = edge;

  if (target.right + gap + width <= window.innerWidth - edge) {
    left = target.right + gap;
    top = Math.min(Math.max(target.top - 18, edge), window.innerHeight - estimatedHeight - edge);
  } else if (target.left - gap - width >= edge) {
    left = target.left - gap - width;
    top = Math.min(Math.max(target.top - 18, edge), window.innerHeight - estimatedHeight - edge);
  } else {
    left = Math.min(Math.max(target.left + target.width / 2 - width / 2, edge), window.innerWidth - width - edge);
    top = target.top - estimatedHeight - gap;
    if (top < edge) top = Math.min(target.bottom + gap, window.innerHeight - estimatedHeight - edge);
  }

  return { target, tooltip: { left, top, width } };
}

export function GuidedTour({ steps, active, onClose }: GuidedTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [position, setPosition] = useState<TourPosition | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    setStepIndex(0);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const step = steps[stepIndex];
    const target = findVisibleTarget(step.targetId);
    if (!target) {
      onClose();
      return;
    }

    target.scrollIntoView({ block: "nearest", inline: "nearest" });
    const update = () => {
      const currentTarget = findVisibleTarget(step.targetId);
      if (currentTarget) setPosition(getPosition(currentTarget.getBoundingClientRect()));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, onClose, stepIndex, steps]);

  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => tooltipRef.current?.focus());
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, onClose, stepIndex]);

  if (!active || !position) return null;

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const padding = 5;

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-label="Tour del portal">
      <div className="fixed inset-0 z-[200]" aria-hidden="true" />
      <div
        className="pointer-events-none fixed z-[201] rounded-2xl ring-2 ring-white/90 transition-all duration-200"
        style={{
          left: position.target.left - padding,
          top: position.target.top - padding,
          width: position.target.width + padding * 2,
          height: position.target.height + padding * 2,
          boxShadow: "0 0 0 9999px rgba(18, 27, 46, 0.64), 0 8px 30px rgba(0,0,0,.24)",
        }}
      />
      <div
        ref={tooltipRef}
        tabIndex={-1}
        className="fixed z-[202] rounded-2xl border border-white/20 bg-white p-5 shadow-2xl outline-none"
        style={position.tooltip}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <span className="rounded-full bg-[#FFF0E1] px-3 py-1 text-xs font-bold text-[#A9571C]">
            {stepIndex + 1}/{steps.length}
          </span>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Salir del tour">
            <X size={17} />
          </button>
        </div>
        {step.title && <h2 className="text-lg font-bold text-[#19345D]">{step.title}</h2>}
        <p className="mt-1.5 text-sm leading-6 text-slate-600">{step.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100">
            Salir
          </button>
          <button
            onClick={() => isLast ? onClose() : setStepIndex((index) => index + 1)}
            className="rounded-xl bg-[#F07845] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#D96334]"
          >
            {isLast ? "Finalizar" : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
