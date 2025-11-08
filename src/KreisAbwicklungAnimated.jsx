import React, { useMemo } from "react";
import { motion, animate } from "framer-motion";

export default function KreisAbwicklungAnimated({ werte }) {
  const size = 300;
  const center = size / 2;
  const maxRadius = size / 2 - 20;
  const n = werte.length;
  const maxWert = Math.max(...werte);
  const step = (2 * Math.PI) / n;

  // Punkte berechnen
  const points = useMemo(() => {
    return werte.map((wert, i) => {
      const angle = i * step - Math.PI / 2;
      const r = (wert / maxWert) * maxRadius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return [x, y];
    });
  }, [werte]);

  points.push(points[0]); // schließen

  // Catmull-Rom → Bézier
  const catmullRomToBezier = (points) => {
    if (points.length < 2) return "";
    const d = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[points.length - 2];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || points[1];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`);
    }
    return `M ${points[0][0]},${points[0][1]} ${d.join(" ")} Z`;
  };

  const pathData = catmullRomToBezier(points);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Kreis-Abwicklung (Animated)</h2>
      <svg width={size} height={size} className="border rounded-lg shadow">
        <circle
          cx={center}
          cy={center}
          r={maxRadius}
          fill="none"
          stroke="#eee"
        />
        <motion.path
          d={pathData}
          fill="none"
          stroke="#007bff"
          strokeWidth="2"
          animate={{ pathLength: 1 }}
          initial={{ pathLength: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {points.slice(0, -1).map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={3}
            fill="#007bff"
            animate={{
              scale: [1, 1.3, 1],
              transition: { duration: 2, repeat: Infinity, delay: i * 0.1 },
            }}
          />
        ))}
      </svg>
    </div>
  );
}
