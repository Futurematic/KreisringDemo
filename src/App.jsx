import React, { useEffect, useState } from "react";
import KreisAbwicklungAnimated from "./KreisAbwicklungAnimated";

export default function App() {
  const [werte, setWerte] = useState([0.3, 0.5, 0.8, 1.0, 0.7, 0.2, 0.4, 0.6]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWerte((prev) => prev.map(() => Math.random()));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <KreisAbwicklungAnimated werte={werte} />
    </div>
  );
}
