"use client";

import { useStore } from "@/app/store/store";
import Image from "next/image";
import startImg3 from "@/../public/2.result/失敗背景.png";

export default function FailedPage() {
  const score = useStore((s) => s.score);
  const maxCombo = useStore((s) => s.maxCombo);
  const accuracy = useStore((s) => s.accuracy);
  const reset = useStore((s) => s.reset);
  const updateState = useStore((state) => state.updateState);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${startImg3.src})` }}
    >
      <h1 className="text-3xl md:text-5xl text-red-700 drop-shadow">FAILED</h1>
      <div className="text-2xl text-center space-y-3 mt-20">
        <p className="text-white">Score：{score}</p>
        <p className="text-white">Max Combo：{maxCombo}</p>
        <p className="text-red-700">Accuracy：{accuracy}%</p>
      </div>

      <div className="flex gap-4 mt-2 ">

        <button
          onClick={() => {
            reset();
            updateState(1);}
          }
            
          className="pixel-button mt-20 bg-[#ffcc00]"
        >
          Play Again
        </button>

        <button
          onClick={reset}
          className="pixel-button mt-20 bg-[#ffcc00]"
        >
          Home
        </button>
      </div>

    </div>
  );
}