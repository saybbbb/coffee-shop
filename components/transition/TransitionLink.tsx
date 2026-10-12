"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "./PageTransition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/** Drop-in <Link> that plays the branded curtain between pages. */
export default function TransitionLink({ href, onClick, ...rest }: Props) {
  const { go } = usePageTransition();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        // Let modified clicks (new tab, etc.) behave normally
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(href);
      }}
      {...rest}
    />
  );
}
