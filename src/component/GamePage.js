"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/app/store/store";

import backgroundImg from "@/../public/1.game/BACKGROUND.png";
import backgroundImg2 from "@/../public/1.game/背景新.png";
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
const HIT_ZONE_X = 180;

const chart = [
  { time: 0.5 }, { time: 1.1 }, { time: 1.9 }, { time: 2.4 }, { time: 3.0 },
  { time: 4.0 }, { time: 4.6 }, { time: 5.3 }, { time: 6.0 }, { time: 6.5 },
  { time: 7.2 }, { time: 8.1 }, { time: 8.9 }, { time: 9.4 }, { time: 10.1 },
  { time: 11.2 }, { time: 11.9 }, { time: 12.4 }, { time: 13.2 }, { time: 13.9 },
  { time: 15.1 }, { time: 15.9 }, { time: 16.6 }, { time: 17.3 }, { time: 17.9 },
  { time: 19.0 }, { time: 19.6 }, { time: 20.3 }, { time: 21.2 }, { time: 21.8 },
  { time: 23.0 }, { time: 23.6 }, { time: 24.4 }, { time: 25.2 }, { time: 25.9 },
  { time: 27.0 }, { time: 28.1 }, { time: 29.0 }, { time: 30.0 }, { time: 31.0 },
  { time: 32.5 }, { time: 34.0 }, { time: 35.5 },
];

export default function GamePage() {
  const updateState = useStore((s) => s.updateState);
  const {
    score,
    maxCombo,
    hits,
    updateScore,
    updateMaxCombo,
    updateAccuracy,
    updateHits,
    updateMisses,
    updateTotal,
  } = useStore();

  const [combo, setCombo] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [showComboText, setShowComboText] = useState(false);
  const [showMissText, setShowMissText] = useState(false);
  const [skeletonJump, setSkeletonJump] = useState(false);
  const [arrows, setArrows] = useState([]);
  const state = useStore((s) => s.state);

  const arrowIdRef = useRef(0);
  const requestRef = useRef(null);
  const lastTimeRef = useRef(null);
  const audioRef = useRef(null);
  const reset = useStore((s) => s.reset);

  useEffect(() => {
    audioRef.current.play();

    const arrowTimers = chart.map((note) =>
      setTimeout(() => {
        const direction = DIRECTIONS[Math.floor(Math.random() * 4)];
        const newArrow = {
          id: arrowIdRef.current++,
          direction,
          left: window.innerWidth + 50,
        };

        setArrows((prev) => [...prev, newArrow]);
        updateTotal(); // ✅ 改為正確遞增
      }, note.time * 1000)
    );

    const endTime = chart[chart.length - 1].time + 0.3;
    const endTimer = setTimeout(() => {
      handleEnd();
    }, endTime * 1000);

    return () => {
      arrowTimers.forEach(clearTimeout);
      clearTimeout(endTimer);
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

      setArrows((prev) => {
        const newArrows = [];
        for (const arrow of prev) {
          const newLeft = arrow.left - ARROW_SPEED * deltaTime;
          if (newLeft <= -50) {
            // ❌ 錯過箭頭
            setCombo(0);
            setComboCount(0);
            updateMisses();
            setShowMissText(true);
            setTimeout(() => setShowMissText(false), 300);
            continue; // 不保留這個箭頭（被移除）
          }
          newArrows.push({ ...arrow, left: newLeft });
        }
        return newArrows;
      });

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
        setArrows((prev) => prev.filter((a) => a.id !== target.id));
        updateScore(useStore.getState().score + 100);
        updateHits();
  
        const newCombo = combo + 1;
        setCombo(newCombo);
        setComboCount(newCombo);
  
        if (newCombo > maxCombo) updateMaxCombo(newCombo);
  
        setSkeletonJump(true);
        setTimeout(() => setSkeletonJump(false), 200);
  
        if (newCombo > 0) {
          setShowComboText(true);
          setTimeout(() => setShowComboText(false), 500);
        }
      } else {
        setCombo(0);
        setComboCount(0);
        updateMisses();
        setShowMissText(true);
        setTimeout(() => setShowMissText(false), 300);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [arrows, combo, maxCombo]);

  const handleEnd = () => {
    const { hits, total } = useStore.getState();
    const acc = total === 0 ? 0 : Math.round((hits / total) * 100);
    updateAccuracy(acc);
    updateState(2);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Image src={backgroundImg2} alt="bg" className="absolute w-full h-full object-cover z-0" />

      {/* 傳送帶 */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-32 flex items-center justify-center z-10">
        <Image src={conveyor} alt="conveyor" className="absolute w-full h-full object-fill z-[-1]" />
        <div
          className="absolute left-[180px] w-16 h-16 border-4 border-white rounded"
          style={{ transform: "translateX(-50%)" }}
        />
      </div>

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

      {showComboText && combo > 0 && (
        <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 text-yellow-300 text-4xl font-extrabold animate-combo-glow z-50">
          Combo X {combo}
        </div>
      )}

      {showMissText && (
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 text-red-500 text-3xl font-bold animate-miss-blink z-50">
          Miss
        </div>
      )}

      <div className="absolute top-6 left-6 text-white text-xl z-20">
        Score：{score}
      </div>

      <button
        onClick={reset}
        className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded z-20"
      >
        Quit
      </button>

      <audio ref={audioRef} src="/1.game/Remember Me.mp3" />
    </div>
  );
}