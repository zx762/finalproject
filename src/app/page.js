"use client"

import StartPage from "@/component/StartPage";
import MusicPreviewPage from "@/component/MusicPreviewPage";
import HowPage from "@/component/HowPage";
import GamePage from "@/component/GamePage";
import ResultPage from "@/component/ResultPage";
import { useState } from "react";
import {useStore} from "@/app/store/store";
import FailedPage from "@/component/FailedPage";
import HitPage from "@/component/HitPage";

export default function Home() {

  const gameState= useStore( (state)=>state);

  return (
    <div>
      <> 
        <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
            { gameState.state == 0 && <StartPage/>}
            { gameState.state == 0.5 && <MusicPreviewPage />}
            { gameState.state == 0.75 && <HowPage />}
            { gameState.state == 1 && <GamePage/>}
            { gameState.state == 2 && <ResultPage />}
            { gameState.state == 3 && <HitPage />}
            { gameState.state == 4 && <FailedPage />}

        </div>
        
        
      </>
    </div>
  );
}
