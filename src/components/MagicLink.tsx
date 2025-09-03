"use client";
import Link from "next/link";
import React, { ReactNode } from "react";

interface MagicLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function MagicLink({
  href,
  children,
  className,
}: MagicLinkProps) {

  return (
    <Link
      href={href}
      className={className}
    >
      {children}
    </Link>
  );
}
