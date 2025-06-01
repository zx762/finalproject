"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import backgroundImg from "@/../public/1.game/BACKGROUND.png";
import subjectImg from "@/../public/1.game/SUBJECT.png";
import arrowUp from "@/../public/1.game/黃上.png";
import arrowDown from "@/../public/1.game/綠下.png";
import arrowLeft from "@/../public/1.game/紅左.png";
import arrowRight from "@/../public/1.game/紫右.png";
import conveyor from "@/../public/1.game/傳送帶.png";
import { useStore } from "@/app/store/store";

const ARROW_IMAGES = {
  ArrowUp: arrowUp,
  ArrowDown: arrowDown,
  ArrowLeft: arrowLeft,
  ArrowRight: arrowRight,
};

const DIRECTIONS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const ARROW_SPEED = 200; // px/s
const INTERVAL_MS = 500; // 每 0.5 秒產生一個箭頭

type Direction = keyof typeof ARROW_IMAGES;

interface Arrow {
  id: number;
  direction: Direction;
  left: number;
}

export default function GamePage() {
  const updateState = useStore((state) => state.updateState);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hits, setHits] = useState(0);
  const [total, setTotal] = useState(0);
  const [audioStarted, setAudioStarted] = useState(false);

  const arrowIdRef = useRef(0);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement>(null);

  const hitZoneX = 150; // 判定區位置

  // 開始產生箭頭
  useEffect(() => {
    if (!audioStarted) return;
    const interval = setInterval(() => {
      const direction = DIRECTIONS[Math.floor(Math.random() * 4)];
      setArrows((prev) => [
        ...prev,
        {
          id: arrowIdRef.current++,
          direction,
          left: window.innerWidth + 50,
        },
      ]);
      setTotal((t) => t + 1);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [audioStarted]);

  // 箭頭移動動畫
  useEffect(() => {
    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
        return;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setArrows((prev) =>
        prev
          .map((arrow) => ({
            ...arrow,
            left: arrow.left - ARROW_SPEED * delta,
          }))
          .filter((arrow) => arrow.left > 0)
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  // 判定邏輯
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!DIRECTIONS.includes(e.key)) return;

      const target = arrows.find(
        (arrow) =>
          arrow.direction === e.key &&
          Math.abs(arrow.left - hitZoneX) < 40
      );

      if (target) {
        // 成功打擊
        setArrows((prev) => prev.filter((a) => a.id !== target.id));
        setScore((s) => s + 100);
        setCombo((c) => {
          const newCombo = c + 1;
          if (newCombo > maxCombo) setMaxCombo(newCombo);
          return newCombo;
        });
        setHits((h) => h + 1);
        // 播放成功音效
        // const hitSound = new Audio("/sfx/hit.mp3"); hitSound.play();
      } else {
        // Miss
        setCombo(0);
        // const missSound = new Audio("/sfx/miss.mp3"); missSound.play();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [arrows, hitZoneX, maxCombo]);

  // 音樂播放結束 ➝ 跳到 result page
  const handleAudioEnd = () => {
    updateState(2); // gameState = 2（結算頁）
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 背景圖 */}
      <Image
        src={backgroundImg}
        alt="background"
        className="absolute w-full h-full object-cover z-0"
      />

      {/* 傳送帶與打擊區固定箭頭 */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-32 flex items-center justify-between z-10">
        <Image
          src={conveyor}
          alt="conveyor"
          className="absolute left-1/2 -translate-x-1/2 w-full h-full object-contain z-[-1]"
        />
        {DIRECTIONS.map((dir) => (
          <Image
            key={dir}
            src={ARROW_IMAGES[dir as keyof typeof ARROW_IMAGES]}
            alt={dir}
            className="w-16 h-16"
          />
        ))}
      </div>

      {/* 骷髏角色 */}
      <div className="absolute bottom-60 left-1/2 -translate-x-1/2 z-10">
        <Image
          src={subjectImg}
          alt="skeleton"
          className="w-[160px] h-auto animate-dance"
        />
      </div>

      {/* 移動中的箭頭 */}
      {arrows.map((arrow) => (
        <Image
          key={arrow.id}
          src={ARROW_IMAGES[arrow.direction as keyof typeof ARROW_IMAGES]}
          alt={arrow.direction}
          className="w-14 h-14 absolute bottom-[140px] z-20"
          style={{ left: `${arrow.left}px` }}
        />
      ))}

      {/* 分數 */}
      <div className="absolute top-6 left-6 text-white text-xl z-20">
        分數：{score}
      </div>

      {/* Quit */}
      <button
        onClick={() => updateState(0)}
        className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded z-20"
      >
        Quit
      </button>

      {/* 音樂控制 */}
      <audio
        ref={audioRef}
        src="/1.game/Remember Me.mp3"
        onEnded={handleAudioEnd}
        onCanPlay={() => {
          if (!audioStarted) {
            setAudioStarted(true);
            audioRef.current?.play();
          }
        }}
      />
    </div>
  );
}