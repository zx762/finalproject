"use client";

import Image from "next/image";
import startImg from "@/../public/0.start/首頁.png";
import { useState } from "react";
import { useStore } from "@/app/store/store";

export default function StartPage() {
  const updateState = useStore((state) => state.updateState);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${startImg.src})`,
        fontFamily: "'Press Start 2P', monospace", // 套用像素字體
      }}
    >
      <h1 className="text-white text-5xl md:text-2xl mb-8 drop-shadow-lg text-center">
        SKULLBEAT
      </h1>
      <button
        onClick={() => updateState(1)}
        className="bg-black text-white p-3 mb-4 rounded shadow-md hover:bg-gray-800 transition-all"
      >
        Start
      </button>
      <button
        onClick={() => updateState(0.5)}
        className="bg-black text-white p-3 rounded shadow-md hover:bg-gray-800 transition-all"
      >
        Music Preview
      </button>
    </div>
  );
}