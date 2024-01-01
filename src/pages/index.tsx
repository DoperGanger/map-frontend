import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import {
  subscribePhaserEvent,
  unsubscribePhaserEvent,
} from "@/gameMapSetup/events/gameEventCenter";

// Dynamically import the PhaserGame component with SSR disabled
const PhaserGameMap = dynamic(() => import("../components/GameMap"), {
  ssr: false,
});

function App() {
  return (
    <div>
      <PhaserGameMap />
    </div>
  );
}

export default App;
