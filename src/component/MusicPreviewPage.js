"use client";

import Image from "next/image";
import startImg2 from "@/../public/0.start/音樂預覽.png";
import skeletonImg from "@/../public/0.start/骷髏_白.png";
import { useState, useEffect, useRef } from "react";
import { useStore } from "@/app/store/store";

const MAX_PREVIEW = 10; // 10秒

export default function MusicPreviewPage() {
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(MAX_PREVIEW);
  const [playDisabled, setPlayDisabled] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [skeletonKey, setSkeletonKey] = useState(0);

  const updateState = useStore((state) => state.updateState);

  useEffect(() => {
    const audio = new Audio("/1.game/Remember Me.mp3");
    audioRef.current = audio;
    audio.currentTime = 0;

    // 清理用
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setHasEnded(true);
    setPlayDisabled(false);
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    setProgress(MAX_PREVIEW);
    setCountdown(0);
  };

  const playPreview = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play();

    setIsPlaying(true);
    setHasStarted(true);
    setPlayDisabled(true);
    setCountdown(MAX_PREVIEW);
    setProgress(0);
    setHasEnded(false);

    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, MAX_PREVIEW));
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      stopPreview();
    }, MAX_PREVIEW * 1000);
  };

  const replayPreview = () => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    setSkeletonKey((prev) => prev + 1);
    playPreview();
  };

  const goBack = () => {
    updateState(0);
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${startImg2.src})` }}
    >
      <h2 className="text-3xl md:text-5xl text-white drop-shadow">MUSIC PREVIEW</h2>

      <div className="flex flex-col gap-2 items-center mt-20">
        {/* 播放預覽按鈕 */}
        <button
          onClick={playPreview}
          disabled={playDisabled}
          className={`pixel-button ${
            playDisabled ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          {hasEnded ? "Preview Ended" : isPlaying ? `Playing：${countdown}s` : "Play 10s Preview"}
        </button>

        {/* 永遠顯示進度條與骷髏容器（預留空間） */}
        <div className="relative mt-2 w-[300px] h-[60px] bg-transparent">
          {/* 線條軌道 */}
          <div
            className={`absolute top-1/2 left-0 w-full h-[2px] transform -translate-y-1/2 transition-opacity duration-500 ${
              hasStarted ? "bg-green-500 opacity-100" : "opacity-0"
            }`}
          />

          {/* 骷髏 */}
          <div
            key={skeletonKey}
            className={`absolute w-12 transition-opacity duration-500 ${
              isPlaying
                ? "preview-dance opacity-100"
                : hasEnded
                ? "skeleton-still opacity-50" // 變暗，改 opacity 比較明顯
                : "opacity-0"
            }`}
            style={{
              left: `calc(${(progress / MAX_PREVIEW) * 100}% - 20px)`,
              bottom: "2px",
              transform: "translateY(0%)",
              transition: "left 1s linear",
            }}
          >
            <Image src={skeletonImg} alt="Skeleton" />
          </div>
        </div>

        {/* 再聽一次 & 返回首頁 */}
        <div className="flex gap-4 mt-2">
          <button onClick={replayPreview} className="pixel-button">
            Replay
          </button>
          <button onClick={goBack} className="pixel-button">
            Home
          </button>
        </div>
      </div>
    </div>
  );
}