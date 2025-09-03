import React from "react";

interface TitleProps {
  children: React.ReactNode;
}

export default function Title({ children }: TitleProps) {
  return (
    <div className="relative inline-block">
      <div className="w-[50%] h-[25%] bg-[#95D4F1] absolute bottom-0 left-[15%]"></div>
      {/* <div className="w-[50%] h-[10%] bg-[#95D4F1] absolute bottom-0 left-[50%] -translate-x-1/2"></div> */}
      <h1 className="text-4xl text-[primary] geist  font-bold relative block">
        {children}
      </h1>
    </div>
  );
}
