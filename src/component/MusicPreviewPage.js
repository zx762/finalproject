"use client";

import Image from "next/image";
import startImg from "@/../public/0.start/首頁.png";
import skeletonImg from "@/../public/0.start/骷髏_白.png";
import volumeImg from "@/../public/0.start/volume.png";
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
  const [isAtEnd, setIsAtEnd] = useState(false);

  const updateState = useStore((state) => state.updateState);

  const [volumeLevel, setVolumeLevel] = useState(0.5); // 0~1 音量

  useEffect(() => {
    audioRef.current = new Audio("/1.game/Remember Me.mp3");
    audioRef.current.currentTime = 0;
    audioRef.current.volume = volumeLevel;
  
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
        if (prev >= MAX_PREVIEW -1) {
          clearInterval(intervalRef.current);
          audioRef.current.pause();
          setIsPlaying(false);
          setHasEnded(true);
          setIsAtEnd(true);
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
    setIsAtEnd(false);
    playPreview();
  };

  const goBack = () => {
    updateState(0);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolumeLevel(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${startImg.src})` }}>

      {/* 放在 return 中、最外層 div 裡面（建議放左上角） */}
      <div
        className="absolute top-4 left-4 flex items-center gap-2 group z-50"
      >
        {/* 音量圖示 */}
        <Image
          src={volumeImg}
          alt="Volume"
          className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        />

        {/* 音量滑桿 */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volumeLevel}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            setVolumeLevel(value);
            if (audioRef.current) {
              audioRef.current.volume = value;
            }
          }}
          className={`
            hidden group-hover:block transition-all duration-300 
            w-24 h-1 appearance-none bg-gray-800 rounded-full
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-yellow-400
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:shadow-md
            [&::-moz-range-thumb]:bg-yellow-400
            [&::-moz-range-thumb]:border-none
          `}
        />
      </div>

      <h2 className="text-3xl md:text-5xl text-white drop-shadow">MUSIC PREVIEW</h2>

      <div className="flex flex-col gap-2 items-center mt-10">
        {/* 播放預覽按鈕 */}
        <button
          onClick={playPreview}
          disabled={isPlaying || hasEnded}
          className={`pixel-button bg-[#ffcc00] text-black ${
            hasEnded ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {hasEnded
            ? "Preview Ended"
            : isPlaying
            ? `Playing：${countdown}s`
            : "Play 10s Preview"}
        </button>


        {/* 永遠顯示進度條與骷髏容器（預留空間） */}
        <div className="relative mt-2 w-[300px] h-[60px] bg-transparent">
          {/* 線條軌道（可根據 hasStarted 控制透明度） */}
          <div className={`absolute top-1/2 left-0 w-full h-[2px] transform -translate-y-1/2 transition-opacity duration-500 ${
            hasStarted ? "bg-green-500 opacity-100" : "opacity-0"
          }`} />

          {/* 骷髏 */}
         {/* 骷髏外層：控制移動 */}
         <div
            key={skeletonKey}
            className={`w-12 bottom-2 ${
              isPlaying
                ? "move-skeleton opacity-100"
                : hasEnded
                ? "opacity-100"
                : "opacity-0"
            }`}
            style={{
              position: "absolute",
              left: isAtEnd ? "calc(100% - 48px)" : undefined,
            }}
          >
            <div className={`
              ${isPlaying ? "preview-dance" : ""}
              ${hasEnded ? "skeleton-static opacity-50" : ""}
            `}>
              <Image src={skeletonImg} alt="Skeleton" />
            </div>
          </div>
        </div>

        {/* 再聽一次 & 返回首頁 */}
        <div className="flex gap-4 mt-2 ">
          <button
            onClick={replayPreview}
            disabled={!hasEnded}
            className={`pixel-button bg-[#ffcc00] text-black ${
              !hasEnded ? "cursor-not-allowed" : ""
            }`}
          >
            Replay
          </button>
          <button
            onClick={goBack}
            className="pixel-button bg-[#ffcc00]"
          >
            Home
          </button>
        </div>
      </div>

      
    </div>
  );
}