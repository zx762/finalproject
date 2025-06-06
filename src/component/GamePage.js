"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/app/store/store";

import backgroundImg from "@/../public/1.game/BACKGROUND.png";
import backgroundImg2 from "@/../public/1.game/背景新2.png";
import subjectImg from "@/../public/1.game/SUBJECT.png";
import arrowUp from "@/../public/1.game/黃上.png";
import arrowDown from "@/../public/1.game/綠下.png";
import arrowLeft from "@/../public/1.game/紅左.png";
import arrowRight from "@/../public/1.game/紫右.png";
import conveyor from "@/../public/1.game/傳送帶1.png";
import bomb from "@/../public/1.game/bomb.png";

const ARROW_IMAGES = {
  ArrowUp: arrowUp,
  ArrowDown: arrowDown,
  ArrowLeft: arrowLeft,
  ArrowRight: arrowRight,
};

const DIRECTIONS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const ARROW_SPEED = 200;
const HIT_ZONE_X = 350;

const chart = [
  { time: 0.5 }, { time: 1.1 }, { time: 1.9 }, { time: 2.4 }, { time: 3.0 },
  { time: 4.0 }, { time: 4.6 }, { time: 5.3 }, { time: 6.0 }, { time: 6.5 },
  { time: 7.2 }, { time: 8.1 }, { time: 8.9 }, { time: 9.4 }, { time: 10.1 },
  { time: 11.2 }, { time: 11.9 }, { time: 12.4 }, { time: 13.2 }, { time: 13.9 },
  { time: 15.1 }, { time: 15.9 }, { time: 16.6 }, { time: 17.3 }, { time: 17.9 },
  { time: 19.0 }, { time: 19.6 }, { time: 20.3 }, { time: 21.2 }, { time: 21.8 },
  { time: 23.0 }, { time: 23.6 }, { time: 24.4 }, { time: 25.2 }, { time: 25.9 },
  { time: 27.0 }, { time: 28.1 }, { time: 28.7 }, { time: 29.7 }, { time: 30.7 }, { time: 31.3 },
  { time: 32.3 }, { time: 33.0 }, { time: 34.2 }, { time: 35.0 },
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

  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      setTimeout(() => {
        startArrowTimers(); // ⏱ 倒數結束後 0.5 秒再開始箭頭與音樂
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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
      
          if (newLeft < HIT_ZONE_X - 40 && !arrow.missed) {
            setCombo(0);
            setComboCount(0);
            updateMisses();
            setShowMissText(true);
            setTimeout(() => setShowMissText(false), 300);
      
            newArrows.push({ ...arrow, left: newLeft, missed: true });
            continue;
          }
      
          if (newLeft < -100) continue; // 完全離開畫面就不保留
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
  
    if (acc < 60) {
      updateState(3); // FailedPage
    } else {
      updateState(2); // ResultPage
    }
  };

  const startArrowTimers = () => {
    const leadTime = 3.5; // 提前時間（秒）
    const audioDuration = 38.5; // 你的音樂實際長度（建議確認）
  
    const maxChartTime = audioDuration + leadTime;
  
    let stopped = false;
  
    const arrowTimers = chart.map((note) => {
      // ✅ 排除音樂還沒開始就應該出現的箭頭（會重疊）
      const delay = (note.time - leadTime) * 1000;
      if (delay < 0) return null;
    
      return setTimeout(() => {
        if (stopped) return;
        const direction = DIRECTIONS[Math.floor(Math.random() * 4)];
        const newArrow = {
          id: arrowIdRef.current++,
          direction,
          left: window.innerWidth + 50,
        };
        setArrows((prev) => [...prev, newArrow]);
        updateTotal();
      }, delay);
    });
  
    const audioTimer = setTimeout(() => {
      audioRef.current.play();
    }, leadTime * 1000);
  
    // ✅ endTimer 改成根據 audioDuration，不是 chart
    const endTimer = setTimeout(() => {
      stopped = true;
      handleEnd();
    }, (audioDuration + 0.2) * 1000);
  
    return () => {
      arrowTimers.forEach((timer) => timer && clearTimeout(timer));
      clearTimeout(audioTimer);
      clearTimeout(endTimer);
    };
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Image src={backgroundImg2} alt="bg" className="absolute w-full h-full object-cover z-0" />

      {/* 傳送帶 */}
      <div className="absolute bottom-20 left-[100px] w-[1700px] h-32 flex items-center justify-start z-10">
        {/* 傳送帶圖片改為 fill 模式 */}
        <Image
          src={conveyor}
          alt="conveyor"
          fill
          className="object-fill z-[-1]"
        />

        {/* 打擊區 */}
        <div className="absolute left-[240px] w-22 h-20 border-4 border-white rounded" />
      </div>

      {/* 骷髏角色 */}
      <div className="absolute bottom-42 left-[290px] z-10">
        <Image
          src={subjectImg}
          alt="skeleton"
          className={`w-[220px] h-auto transition-all duration-100 ${
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
          className="w-14 h-14 absolute bottom-[120px] z-20"
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

      {countdown > 0 && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="text-white text-7xl font-extrabold animate-scale-pop">
            {countdown}
          </div>
        </div>
      )}

    </div>
  );
}