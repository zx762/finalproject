"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/app/store/store";

import backgroundImg from "@/../public/1.game/BACKGROUND.png";
import subjectImg from "@/../public/1.game/SUBJECT.png";
import arrowUp from "@/../public/1.game/黃上.png";
import arrowDown from "@/../public/1.game/綠下.png";
import arrowLeft from "@/../public/1.game/紅左.png";
import arrowRight from "@/../public/1.game/紫右.png";
import conveyor from "@/../public/1.game/傳送帶.png";

const ARROW_IMAGES = {
  ArrowUp: arrowUp,
  ArrowDown: arrowDown,
  ArrowLeft: arrowLeft,
  ArrowRight: arrowRight,
};

const DIRECTIONS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const ARROW_SPEED = 200;
const HIT_ZONE_X = 180; // ← 根據你的框框位置微調
const MUSIC_DURATION = 20;

export default function GamePage() {
  const updateState = useStore((state) => state.updateState);
  const updateScore = useStore((state) => state.updateScore);
  const updateMaxCombo = useStore((state) => state.updateMaxCombo);
  const updateAccuracy = useStore((state) => state.updateAccuracy);

  const [arrows, setArrows] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxComboLocal] = useState(0);
  const [hits, setHits] = useState(0);
  const [total, setTotal] = useState(0);
  const [skeletonJump, setSkeletonJump] = useState(false);
  const [comboCount, setComboCount] = useState(0);

  const arrowIdRef = useRef(0);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const [showComboText, setShowComboText] = useState(false);
  const [showMissText, setShowMissText] = useState(false);


  useEffect(() => {
    audioRef.current.play();

    intervalRef.current = setInterval(() => {
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
    }, 500);

    const timeout = setTimeout(() => {
      handleEnd();
    }, MUSIC_DURATION * 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const animate = (time) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
        return;
      }
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setArrows((prev) =>
        prev
          .map((arrow) => ({
            ...arrow,
            left: arrow.left - ARROW_SPEED * deltaTime,
          }))
          .filter((arrow) => arrow.left > 0)
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!DIRECTIONS.includes(e.key)) return;

      const target = arrows.find(
        (arrow) =>
          arrow.direction === e.key &&
          Math.abs(arrow.left - HIT_ZONE_X) < 40
      );

      if (target) {
        // 命中
        setArrows((prev) => prev.filter((a) => a.id !== target.id));
        const newScore = score + 100;
        setScore(newScore);
        setHits((h) => h + 1);
        const newCombo = combo + 1;
        setCombo(newCombo);
        setComboCount(newCombo);
        if (newCombo > maxCombo) {
          setMaxComboLocal(newCombo);
        }
        setSkeletonJump(true);
        setTimeout(() => setSkeletonJump(false), 200);
        setShowComboText(true);
        setTimeout(() => setShowComboText(false), 500);
      } else {
        // Miss
        setCombo(0);
        setComboCount(0);
        setShowMissText(true);
        setTimeout(() => setShowMissText(false), 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [arrows, maxCombo]);

  const handleEnd = () => {
        const acc = Math.round((hits / total) * 100 || 0);
        updateScore(score);         // ✅ 同步 store
        updateMaxCombo(maxCombo);   // ✅ 同步 store
        updateAccuracy(acc);        // ✅ 同步 store
        updateState(2);             // 跳轉 result 頁
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Image
            src={backgroundImg}
            alt="background"
            className="absolute w-full h-full object-cover z-0"
      />

      {/* 傳送帶 */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-32 flex items-center justify-center z-10">
        <Image
          src={conveyor}
          alt="conveyor"
          className="absolute w-full h-full object-contain z-[-1]"
        />
        <div
          className="absolute left-[180px] w-16 h-16 border-4 border-white rounded"
          style={{ transform: "translateX(-50%)" }}
        />
      </div>

        {/* Combo 效果，帶次數 */}
        {showComboText && (
        <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 text-yellow-300 text-4xl font-extrabold animate-combo-glow z-50">
            COMBO X {comboCount}
        </div>
        )}

        {/* Miss 提示效果 */}
        {showMissText && (
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 text-red-500 text-3xl font-bold animate-miss-blink z-50">
            MISS
        </div>
        )}

      {/* 骷髏角色 */}
      <div className="absolute bottom-56 left-[100px] z-10">
        <Image
          src={subjectImg}
          alt="skeleton"
          className={`w-[180px] h-auto transition-all duration-100 ${
            skeletonJump ? "jump-dance" : ""
          }`}
        />
      </div>

      {/* 飛行箭頭 */}
      {arrows.map((arrow) => (
        <Image
          key={arrow.id}
          src={ARROW_IMAGES[arrow.direction]}
          alt={arrow.direction}
          className="w-14 h-14 absolute bottom-[140px] z-20"
          style={{ left: `${arrow.left}px` }}
        />
      ))}

      <div className="absolute top-6 left-6 text-white text-xl z-20">
            Score：{score}
      </div>

      <button
        onClick={() => updateState(0)}
        className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded z-20">
            Quit
      </button>

      <audio ref={audioRef} src="/1.game/Remember Me.mp3" />
    </div>
  );
}