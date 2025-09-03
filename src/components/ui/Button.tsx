"use client";
import MagicLink from "@/components/MagicLink";
import React from "react";
import TextRollover from "@/components/animations/TextRollover";

type ButtonProps = {
  children: React.ReactNode;
  href: string;
  type: "solid" | "outline";
};

export default function Button({
  children,
  href,
  type = "solid",
}: ButtonProps) {
  let className = "rounded-full geist font-medium transition-all";
  if (type === "solid") {
    className += " bg-[#4990f9] text-white";
  }
  if (type === "outline") {
    className +=
      " bg-white border border-[#4990f9] text-[#4990f9] hover:bg-[#4990f9] hover:text-white transition-all duration-300";
  }

  return (
    <div className={`${className} shadow-sm`}>
      <MagicLink
        href={href}
        className="block rounded-md relative overflow-hidden"
      >
        <TextRollover className="mx-6 my-2 overflow-hidden">
          {children}
        </TextRollover>
      </MagicLink>
    </div>
  );
}
