"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { formatPrice, type MenuItem } from "@/data/menu";
import { QUESTIONS, describeMatch, findYourBrew, type QuizAnswers } from "@/lib/findYourBrew";
import MenuArt from "@/components/menu/MenuArt";
import QuickAdd from "@/components/menu/QuickAdd";

/** Three-question quiz that ends on a matching drink. */
export default function FindYourBrew({ onClose, onOpen }: { onClose: () => void; onOpen: (item: MenuItem) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const done = step >= QUESTIONS.length;

  useEffect(() => {
    window.__lenis?.stop();
    gsap.fromTo(panelRef.current, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.6)" });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [onClose]);

  // Each step slides in
  useEffect(() => {
    gsap.fromTo(bodyRef.current, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" });
  }, [step]);

  const choose = (key: string, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  };

  const result = done ? findYourBrew(answers as Required<QuizAnswers>) : null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Find your brew"
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="w-full sm:max-w-xl max-h-[92dvh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] shadow-2xl"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        {/* Header + progress */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="sheet-label">Find your brew</p>
            <div className="flex gap-1.5" aria-hidden="true">
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 w-10 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: i < step ? "var(--color-primary)" : "var(--color-outline-variant)" }}
                />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/5 cursor-pointer" aria-label="Close">
            <span aria-hidden="true" className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>
              close
            </span>
          </button>
        </div>

        <div ref={bodyRef} className="px-6 pb-7">
          {!done ? (
            <QuestionStep step={step} onChoose={choose} onBack={step > 0 ? () => setStep((s) => s - 1) : undefined} />
          ) : (
            result && (
              <div className="space-y-5">
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-lg">
                  <div ref={artRef} className="absolute inset-0">
                    <MenuArt item={result.best} sizes="(max-width: 640px) 100vw, 560px" iconSize="6rem" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute left-5 bottom-4 right-5 text-white">
                    <p className="text-xs font-mono uppercase tracking-wider text-amber-200" style={{ fontFamily: "var(--font-label)" }}>
                      Your brew is…
                    </p>
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                      {result.best.name}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}>
                  {describeMatch(answers as Required<QuizAnswers>)}
                </p>
                <p className="leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                  {result.best.description}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-black mr-auto" style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}>
                    {formatPrice(result.best.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpen(result.best);
                    }}
                    className="nurvana-btn-outline cursor-pointer"
                  >
                    Customize
                  </button>
                  <QuickAdd item={result.best} artRef={artRef} />
                </div>
                {result.runnerUp && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpen(result.runnerUp!);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border text-left cursor-pointer transition-colors hover:bg-black/[0.03]"
                    style={{ borderColor: "var(--color-outline-variant)" }}
                  >
                    <span className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <MenuArt item={result.runnerUp} sizes="48px" iconSize="1.4rem" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}>
                        Also try
                      </span>
                      <span className="block font-semibold truncate" style={{ color: "var(--color-primary)" }}>
                        {result.runnerUp.name}
                      </span>
                    </span>
                    <span className="text-sm font-mono" style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}>
                      {formatPrice(result.runnerUp.price)}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setAnswers({});
                    setStep(0);
                  }}
                  className="w-full text-sm font-semibold py-2 cursor-pointer underline-offset-4 hover:underline"
                  style={{ color: "var(--color-secondary)" }}
                >
                  Take the quiz again
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function QuestionStep({
  step,
  onChoose,
  onBack,
}: {
  step: number;
  onChoose: (key: string, value: string) => void;
  onBack?: () => void;
}) {
  const q = QUESTIONS[step];
  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)" }}>
        {q.title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {q.options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChoose(q.key, o.value)}
            className="quiz-option group flex sm:flex-col items-center sm:items-start gap-3 p-4 rounded-2xl border text-left cursor-pointer"
          >
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: "var(--color-secondary-fixed)", color: "var(--color-primary)" }}
            >
              <span aria-hidden="true" className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {o.icon}
              </span>
            </span>
            <span>
              <span className="block font-bold" style={{ color: "var(--color-primary)" }}>
                {o.label}
              </span>
              <span className="block text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                {o.hint}
              </span>
            </span>
          </button>
        ))}
      </div>
      {onBack && (
        <button type="button" onClick={onBack} className="text-sm font-semibold cursor-pointer inline-flex items-center gap-1" style={{ color: "var(--color-secondary)" }}>
          <span aria-hidden="true" className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back
        </button>
      )}
    </div>
  );
}
