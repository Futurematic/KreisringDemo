import React from "react";

export default function KreisringAbwicklung({ werte, variant = "segment" }) {
  const size = 300;
  const center = size / 2;
  const baseRadius = size / 2 - 20;
  const n = werte.length;
  const mean = werte.reduce((a, b) => a + b, 0) / n;
  const scale = 15;
  const step = (2 * Math.PI) / n;

  // Punkte auf Außen- & Innenkontur
  const outer = werte.map((wert, i) => {
    const angle = i * step - Math.PI / 2;
    const r = baseRadius + (wert - mean) * scale;
    return [
      center + r * Math.cos(angle),
      center + r * Math.sin(angle),
    ];
  });

  const inner = werte.map((wert, i) => {
    const angle = i * step - Math.PI / 2;
    const r = baseRadius - 20 + (wert - mean) * scale * 0.5;
    return [
      center + r * Math.cos(angle),
      center + r * Math.sin(angle),
    ];
  }).reverse();

  // Ersten Punkt ans Ende hängen -> Ring sauber schließen
  outer.push(outer[0]);
  inner.push(inner[0]);

  // Hilfsfunktion Bézier
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

  // Pfaddaten für Außen- und Innenlinie kombinieren
  const allPoints = [...outer, ...inner];
  const pathData = catmullRomToBezier(allPoints);

  // Farbverlauf abhängig von Variante
  const gradientId = `grad-${variant}`;
  const gradientStops =
    variant === "smooth" ? (
      <>
        <stop offset="0%" stopColor="#00ff88" />
        <stop offset="50%" stopColor="#ffff44" />
        <stop offset="100%" stopColor="#ff0044" />
      </>
    ) : (
      werte.map((wert, i) => {
        const norm = (wert - Math.min(...werte)) / (Math.max(...werte) - Math.min(...werte));
        const color = norm < 0.33 ? "#00ff88" : norm < 0.66 ? "#ffff44" : "#ff0044";
        const offset = `${(i / werte.length) * 100}%`;
        return <stop key={i} offset={offset} stopColor={color} />;
      })
    );

  return (
    <svg width={size} height={size} className="bg-white rounded-lg shadow border">
      <defs>
        <linearGradient id={gradientId} gradientTransform="rotate(90)">
          {gradientStops}
        </linearGradient>
      </defs>

      {/* Weißer Innenraum */}
      <circle cx={center} cy={center} r={baseRadius - 30} fill="white" />

      {/* Rohrwand */}
      <path
        d={pathData}
        fill={`url(#${gradientId})`}
        stroke="#007bff"
        strokeWidth="2"
      />

      {/* Hilfskreis */}
      <circle
        cx={center}
        cy={center}
        r={baseRadius - 10}
        fill="none"
        stroke="#ccc"
        strokeDasharray="4 4"
      />
    </svg>
  );
}
