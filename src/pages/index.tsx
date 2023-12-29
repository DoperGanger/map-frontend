import React from "react";

import dynamic from "next/dynamic";

// Dynamically import the PhaserGame component with SSR disabled
const PhaserGameMap = dynamic(() => import("../components/GameMap"), {
  ssr: false,
  // You can add a loading component here if needed
});

function App() {
  return (
    <div>
      <PhaserGameMap />
    </div>
  );
}

export default App;
