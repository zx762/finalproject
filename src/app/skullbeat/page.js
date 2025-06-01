"use client"

import StartPage from "@/component/StartPage";
import MusicPreviewPage from "@/component/MusicPreviewPage";
import GamePage from "@/component/GamePage";
import ResultPage from "@/component/ResultPage";
import { useState } from "react";
import {useStore} from "@/app/store/store";

export default function Skullbeat() {

  const gameState= useStore( (state)=>state);

  return (
    <div>
      <> 
        <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
            { gameState.state == 0 && <StartPage/>}
            { gameState.state == 0.5 && <MusicPreviewPage />}
            { gameState.state == 1 && <GamePage/>}
            { gameState.state == 2 && <ResultPage />}

        </div>
        
        
      </>
    </div>
  );
}
