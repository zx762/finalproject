"use client";
import { useStore } from "@/app/store/store";
import Image from "next/image";
import startImg2 from "@/../public/0.start/音樂預覽.png";

export default function ResultPage() {
  const { score, maxCombo, accuracy, reset } = useStore();

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${startImg2.src})` }}
    >
      <h1 className="text-3xl mb-6 text-white">🎉 FINISHED！</h1>
      <div className="text-white text-2xl space-y-3">
        <p>Score：{score}</p>
        <p>Max Combo：{maxCombo}</p>
        <p>Accuracy：{accuracy}%</p>
      </div>

      <button
        onClick={reset}
        className="mt-10 px-6 py-3 bg-red-500 hover:bg-red-600 rounded text-white text-lg"
      >
        HOME
      </button>
    </div>
  );
}