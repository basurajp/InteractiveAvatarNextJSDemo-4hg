"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";
export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-[900px] flex flex-col items-center justify-center gap-5 px-4 py-8">
        <div className="w-full">
          <InteractiveAvatar />
        </div>
      </div>
    </div>
  );
}
