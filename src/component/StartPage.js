"use client";

import Image from "next/image";
import startImg from "@/../public/0.start/首頁.png";
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
      <h1
        className="text-white text-4xl md:text-8xl drop-shadow-lg text-center"
      >
        SKULLBEAT
      </h1>
      <button
        onClick={() => updateState(1)}
        className="pixel-button mt-20 bg-[#ffcc00]"
      >
        Start
      </button>
      <button
        onClick={() => updateState(0.5)}
        className="pixel-button mt-4 bg-[#ffcc00]"
      >
        Music Preview
      </button>

      <button
        onClick={() => updateState(0.75)}
        className="pixel-button mt-4 bg-[#ffcc00]"
      >
        How to Play
      </button>
    </div>
  );
}