import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { PreloadScene } from "@/gameMapSetup/scenes/preload-scene";
import { WorldScene } from "@/gameMapSetup/scenes/world-scene";

const GameMap: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      pixelArt: false,
      scale: {
        parent: "game-container",
        width: 320,
        height: 320,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: "#000000",
      scene: [PreloadScene, WorldScene],
    };

    const game = new Phaser.Game(gameConfig);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
};

export default GameMap;
