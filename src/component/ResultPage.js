"use client"

import { useState } from "react";
import {useStore} from "@/app/store/store";

export default function ResultPage() {

    const score = useStore((state) => state.score);
    const updateState = useStore((state) => state.updateState);
    const reset = useStore((state) => state.reset);


  return (
    <div className="text-center">
      <h2 className="text-3xl mb-4">🎉 遊戲結束！</h2>
      <p className="text-xl mb-4">你的分數是：{score}</p>
      <button onClick={() => updateState(1)}>🔁 再玩一次</button>
      <button onClick={reset}>🏠 回首頁</button>
    </div>
  );
}