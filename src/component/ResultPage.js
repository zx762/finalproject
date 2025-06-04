"use client";

import { useStore } from "@/app/store/store";
import Image from "next/image";
import startImg2 from "@/../public/0.start/音樂預覽.png";
import startImg from "@/../public/0.start/首頁.png";

export default function ResultPage() {
  const score = useStore((s) => s.score);
  const maxCombo = useStore((s) => s.maxCombo);
  const accuracy = useStore((s) => s.accuracy);
  const reset = useStore((s) => s.reset);
  const updateState = useStore((state) => state.updateState);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${startImg.src})` }}
    >
      <h1 className="text-3xl md:text-5xl text-white drop-shadow">🎉FINISHED🎉</h1>
      <div className="text-white text-2xl text-center space-y-3 mt-20">
        <p>Score：{score}</p>
        <p>Max Combo：{maxCombo}</p>
        <p>Accuracy：{accuracy}%</p>
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