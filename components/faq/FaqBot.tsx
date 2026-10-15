"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { answer, STARTER_QUESTIONS, type BotAction, type BotReply } from "@/lib/faq";
import { allItems, formatPrice, type MenuItem } from "@/data/menu";
import { usePageTransition } from "@/components/transition/PageTransition";
import MenuArt from "@/components/menu/MenuArt";
import QuickAdd from "@/components/menu/QuickAdd";
import ItemSheet from "@/components/menu/ItemSheet";

type Message = { id: number; from: "user"; text: string } | { id: number; from: "bot"; reply: BotReply };

const WELCOME: BotReply = {
  text: "Hi! I'm the Nurvana helper. Ask me about our menu, hours, pickup orders or how to find us.",
  followUps: STARTER_QUESTIONS,
};

/** Reveals bot text a few words at a time so replies feel typed, not pasted. */
function TypedText({ text, onDone }: { text: string; onDone: () => void }) {
  const words = text.split(" ");
  const [shown, setShown] = useState(0);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      n = Math.min(words.length, n + 2);
      setShown(n);
      if (n >= words.length) {
        clearInterval(t);
        doneRef.current();
      }
    }, 45);
    return () => clearInterval(t);
  }, [text, words.length]);

  return <>{words.slice(0, shown).join(" ")}</>;
}

function ItemRow({ item, onView }: { item: MenuItem; onView: (i: MenuItem) => void }) {
  const artRef = useRef<HTMLDivElement>(null);
  return (
    <li className="flex items-center gap-3 p-2 pr-2.5 rounded-2xl bg-white/70 border" style={{ borderColor: "var(--color-outline-variant)" }}>
      <div ref={artRef} className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0">
        <MenuArt item={item} sizes="44px" iconSize="1.3rem" />
      </div>
      <button type="button" onClick={() => onView(item)} className="flex-1 min-w-0 text-left cursor-pointer group">
        <span className="block text-sm font-semibold truncate group-hover:underline underline-offset-2" style={{ color: "var(--color-primary)" }}>
          {item.name}
        </span>
        <span className="block text-xs font-mono" style={{ color: "var(--color-secondary)", fontFamily: "var(--font-label)" }}>
          {formatPrice(item.price)}
          {item.tags?.length ? ` · ${item.tags.slice(0, 2).join(" · ")}` : ""}
        </span>
      </button>
      <QuickAdd item={item} artRef={artRef} small />
    </li>
  );
}

function BotBubble({
  reply,
  latest,
  onAction,
  onView,
  onAsk,
}: {
  reply: BotReply;
  latest: boolean;
  onAction: (a: BotAction) => void;
  onView: (i: MenuItem) => void;
  onAsk: (q: string) => void;
}) {
  // Extras (lists, cards, buttons) appear once the text has finished "typing"
  // With reduced motion the whole reply appears at once
  const [typed, setTyped] = useState(() => !latest || prefersReducedMotion());
  return (
    <div className="flex gap-2.5 items-start">
      <span className="relative w-7 h-7 rounded-full overflow-hidden bg-white shrink-0 ring-1 ring-black/5 mt-0.5" aria-hidden="true">
        <Image src="/icon.jpg" alt="" fill sizes="28px" className="object-cover" unoptimized />
      </span>
      <div className="flex-1 min-w-0 space-y-2.5">
        <div
          className="inline-block max-w-full rounded-2xl rounded-tl-md px-3.5 py-2.5 text-sm leading-relaxed"
          style={{ backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface)" }}
        >
          {typed ? reply.text : <TypedText text={reply.text} onDone={() => setTyped(true)} />}
        </div>

        {typed && (
          <div className="faq-extras space-y-2.5">
            {reply.bullets && (
              <ul className="space-y-1 pl-1">
                {reply.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--color-secondary)" }} />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {reply.items && reply.items.length > 0 && (
              <ul className="space-y-2">
                {reply.items.map((i) => (
                  <ItemRow key={i.id} item={i} onView={onView} />
                ))}
              </ul>
            )}
            {reply.actions && (
              <div className="flex flex-wrap gap-2">
                {reply.actions.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => onAction(a)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-transform hover:scale-[1.03]"
                    style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
                  >
                    {a.icon && <span aria-hidden="true" className="material-symbols-outlined text-sm">{a.icon}</span>}
                    {a.label}
                  </button>
                ))}
              </div>
            )}
            {latest && reply.followUps && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {reply.followUps.map((f) => (
                  <button key={f} type="button" onClick={() => onAsk(f)} className="faq-chip">
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FaqBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: "bot", reply: WELCOME }]);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [viewItem, setViewItem] = useState<MenuItem | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const { go } = usePageTransition();

  // Other parts of the site (e.g. the footer's "Ask Nurvana" link) can open the helper
  useEffect(() => {
    const openHelper = () => setOpen(true);
    window.addEventListener("nurvana:open-faq", openHelper);
    return () => window.removeEventListener("nurvana:open-faq", openHelper);
  }, []);

  // Open / close animation, Escape to close, focus the input
  useEffect(() => {
    if (!open) return;
    if (prefersReducedMotion()) gsap.fromTo(panelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    else gsap.fromTo(panelRef.current, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.6)" });
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  });

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { id: nextId.current++, from: "user", text: q }]);
    setInput("");
    setThinking(true);
    const reply = answer(q);
    // A short, length-aware pause makes it feel like it's thinking
    setTimeout(() => {
      setMessages((m) => [...m, { id: nextId.current++, from: "bot", reply }]);
      setThinking(false);
    }, 450 + Math.min(700, reply.text.length * 4));
  };

  const onAction = (a: BotAction) => {
    if (a.kind === "go" && /^https?:/.test(a.href)) {
      // External (e.g. Google Maps directions): new tab, keep the chat open
      window.open(a.href, "_blank", "noopener,noreferrer");
    } else if (a.kind === "go") {
      setOpen(false);
      go(a.href);
    } else {
      const item = allItems.find((i) => i.id === a.itemId);
      if (item) viewItemFromChat(item);
    }
  };

  // Viewing a drink tucks the chat away (the sheet would sit behind it) and
  // brings it back, conversation intact, when the sheet closes
  const viewItemFromChat = (item: MenuItem) => {
    setOpen(false);
    setViewItem(item);
  };
  const closeItem = () => {
    setViewItem(null);
    setOpen(true);
  };

  const lastBotId = [...messages].reverse().find((m) => m.from === "bot")?.id;

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="faq-launcher fixed bottom-5 left-4 sm:left-6 z-[55] flex items-center gap-2 h-12 pl-3 pr-3 sm:pr-4 rounded-full shadow-xl cursor-pointer transition-transform hover:scale-[1.04]"
          style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
          aria-label="Ask Nurvana: questions about the menu, hours and pickup"
        >
          <span className="relative">
            <span aria-hidden="true" className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              forum
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-300 ring-2 ring-[var(--color-primary)]" />
          </span>
          <span className="hidden sm:inline text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Ask Nurvana
          </span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Ask Nurvana"
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:w-[390px] z-[65] flex flex-col rounded-[26px] shadow-2xl overflow-hidden origin-bottom-left border"
          style={{
            height: "min(600px, calc(100dvh - 7rem))",
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-outline-variant)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}>
            <span className="relative w-9 h-9 rounded-full overflow-hidden bg-white shrink-0">
              <Image src="/icon.jpg" alt="" fill sizes="36px" className="object-cover" unoptimized />
            </span>
            <div className="flex-1 min-w-0 leading-tight">
              <p className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Ask Nurvana
              </p>
              <p className="text-xs text-amber-100/75 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Menu, hours &amp; pickup help
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer"
              aria-label="Close"
            >
              <span aria-hidden="true" className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Conversation */}
          <div ref={listRef} data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-4 space-y-4" aria-live="polite">
            {messages.map((m) =>
              m.from === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p
                    className="max-w-[80%] rounded-2xl rounded-tr-md px-3.5 py-2.5 text-sm"
                    style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
                  >
                    {m.text}
                  </p>
                </div>
              ) : (
                <BotBubble
                  key={m.id}
                  reply={m.reply}
                  latest={m.id === lastBotId}
                  onAction={onAction}
                  onView={viewItemFromChat}
                  onAsk={ask}
                />
              )
            )}
            {thinking && (
              <div className="flex gap-2.5 items-center" aria-label="Typing">
                <span className="w-7" />
                <span className="flex gap-1 px-3.5 py-3 rounded-2xl rounded-tl-md" style={{ backgroundColor: "var(--color-surface-container)" }}>
                  <span className="faq-dot" />
                  <span className="faq-dot" style={{ animationDelay: "0.15s" }} />
                  <span className="faq-dot" style={{ animationDelay: "0.3s" }} />
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 px-3 pt-2 pb-1 border-t"
            style={{ borderColor: "var(--color-outline-variant)" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about drinks, hours, pickup…"
              maxLength={160}
              className="flex-1 min-w-0 rounded-full px-4 py-2.5 text-sm outline-none border focus:ring-2"
              style={{ borderColor: "var(--color-outline-variant)", backgroundColor: "var(--color-surface-container-low)" }}
              aria-label="Your question"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center cursor-pointer transition-opacity disabled:opacity-40 disabled:cursor-default"
              style={{ backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)" }}
              aria-label="Send"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-lg">arrow_upward</span>
            </button>
          </form>
          <p className="text-[10px] text-center pb-2 pt-1" style={{ color: "var(--color-outline)" }}>
            Quick answers from our menu &amp; café info · not a live person
          </p>
        </div>
      )}

      {viewItem && <ItemSheet item={viewItem} onClose={closeItem} />}
    </>
  );
}
