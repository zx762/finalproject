"use client";

import Image from "next/image";
import startImg from "@/../public/0.start/首頁.png";
import { useEffect, useState } from "react";
import { useStore } from "@/app/store/store";

const lines = [
    "1. Dance with the arrow keys (⇧ ⇩ ⇦ ⇨)",
    "2. Hit notes in the glowing zone",
    "3. Each combo hit= 100 points",
    "4. Stay sharp — 60% accuracy to survive!",
  ];


export default function HowPage() {
    const updateState = useStore((state) => state.updateState);

    
    const goBack = () => {
        updateState(0);
      };

    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [displayedLines, setDisplayedLines] = useState([]);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
        
    useEffect(() => {
        if (currentLineIndex >= lines.length) return;
      
        const line = lines[currentLineIndex];
      
        if (currentCharIndex < line.length) {
          const timeout = setTimeout(() => {
            setDisplayedLines((prev) => {
              const currentLine = prev[currentLineIndex] || "";
              const updatedLines = [...prev];
              updatedLines[currentLineIndex] = currentLine + line[currentCharIndex];
              return updatedLines;
            });
            setCurrentCharIndex((prev) => prev + 1);
          }, 40);
      
          return () => clearTimeout(timeout);
        } else {
          const nextLineTimeout = setTimeout(() => {
            setCurrentLineIndex((prev) => prev + 1);
            setCurrentCharIndex(0);
          }, 500);
      
          return () => clearTimeout(nextLineTimeout);
        }
      }, [currentCharIndex, currentLineIndex]);


    return (
      <div
        className="w-screen h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${startImg.src})`,
          fontFamily: "'Press Start 2P', monospace", // 套用像素字體
        }}
      >
        <h1
          className="text-3xl md:text-5xl text-white drop-shadow"
        >
          HOW TO PLAY
        </h1>

        <div 
            className="mt-10 leading-loose font-mono whitespace-pre-line text-center"
            style={{
                fontFamily: "'Press Start 2P', monospace", // 套用像素字體
                minHeight: "8rem"
              }}>
            {displayedLines.map((line, index) => (
                <div key={index}>{line}</div>
            ))}
        </div>


        <button
            onClick={goBack}
            className="pixel-button bg-[#ffcc00] mt-10"
          >
            Home
        </button>
        
     
      </div>
    );
  }