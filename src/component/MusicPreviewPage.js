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

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(MAX_PREVIEW);
  const [playDisabled, setPlayDisabled] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [skeletonKey, setSkeletonKey] = useState(0);

  const updateState = useStore((state) => state.updateState);

  useEffect(() => {
    audioRef.current = new Audio("/1.game/Remember Me.mp3");
    audioRef.current.currentTime = 0;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      clearInterval(intervalRef.current);
    };
  }, []);

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

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= MAX_PREVIEW - 1) {
          clearInterval(intervalRef.current);
          audioRef.current.pause();
          setIsPlaying(false);
          setHasEnded(true);
          return MAX_PREVIEW;
        }
        return prev + 1;
      });

      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
  };

  const replayPreview = () => {
    clearInterval(intervalRef.current);
    setSkeletonKey((prev) => prev +1 );
    playPreview();
  };

  const goBack = () => {
    updateState(0);
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${startImg2.src})` }}>

      <h2 className="text-2xl font-bold mb-4 text-white drop-shadow">MUSIC PREVIEW</h2>

      <div className="flex flex-col gap-2 items-center">
        {/* 播放預覽按鈕 */}
        <button
          onClick={playPreview}
          disabled={playDisabled}
          className={`px-4 py-2 rounded ${
            playDisabled
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}>

          {hasEnded
            ? "Preview Ended"
            : isPlaying
            ? `Playing：${countdown}s`
            : "Play 10s Preview"}
        </button>


        {/* 細線進度條與骷髏 */}
        {hasStarted && (
        <div className="relative mt-12 w-[300px] h-[60px] bg-transparent">
            {/* 線條軌道 */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-green-500 transform -translate-y-1/2" />

            {/* 骷髏站在線上跳舞／靜止 */}
            <div
                key={skeletonKey}
                className={`absolute w-12 transition-opacity duration-500 ${
                    isPlaying ? "preview-dance" : hasEnded ? "skeleton-still" : "hidden"
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
        )}

        {/* 再聽一次 & 返回首頁 */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={replayPreview}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Replay
          </button>
          <button
            onClick={goBack}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Home
          </button>
        </div>
      </div>

      
    </div>
  );
}