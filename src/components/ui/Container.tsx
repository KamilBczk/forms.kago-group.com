import React from "react";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-4">
      {children}
    </div>
  );
}
