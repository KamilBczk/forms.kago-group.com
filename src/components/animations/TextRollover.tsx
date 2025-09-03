"use client";
import React from "react";
import gsap from "gsap";

type TextRolloverProps = {
  children: React.ReactNode;
  className?: string;
};

export default function TextRollover({
  children,
  className,
}: TextRolloverProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    const letters = target.querySelectorAll(".letter");

    letters.forEach((letter, i) => {
      const textTop = letter.querySelector(".text-top");
      const textBottom = letter.querySelector(".text-bottom");

      if (textTop && textBottom) {
        gsap.to(textTop, {
          yPercent: -100,
          duration: 0.3,
          delay: i * 0.01,
          ease: "power2.inOut",
        });

        gsap.to(textBottom, {
          yPercent: -100,
          duration: 0.3,
          delay: i * 0.01,
          ease: "power2.inOut",
        });
      }
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    const letters = target.querySelectorAll(".letter");

    letters.forEach((letter, i) => {
      const textTop = letter.querySelector(".text-top");
      const textBottom = letter.querySelector(".text-bottom");

      if (textTop && textBottom) {
        gsap.to([textTop, textBottom], {
          yPercent: 0,
          duration: 0.3,
          delay: i * 0.01,
          ease: "power2.inOut",
        });
      }
    });
  };

  return (
    <span
      className={`block relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children
        ?.toString()
        .split("")
        .map((char, i) => (
          <span key={i} className="letter inline-block relative">
            {char === " " ? (
              <span className="inline-block w-2">&nbsp;</span>
            ) : (
              <>
                <span className="text-top block">{char}</span>
                <span className="text-bottom absolute top-full left-0">
                  {char}
                </span>
              </>
            )}
          </span>
        ))}
    </span>
  );
}
