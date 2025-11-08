import React from "react";

export default function KreisringAbwicklung({ werte }) {
  const size = 300;
  const center = size / 2;
  const baseRadius = size / 2 - 20;
  const n = werte.length;
  const maxWert = Math.max(...werte);
  const minWert = Math.min(...werte);
  const step = (2 * Math.PI) / n;

  // Skaliere Werte auf Abweichung um Mittelwert
  const mean = werte.reduce((a, b) => a + b, 0) / werte.length;
  const scale = 15; // Stärke der sichtbaren Wandabweichung

  // Punkte für äußere und innere Wand
  const outer = werte.map((wert, i) => {
    const angle = i * step - Math.PI / 2;
    const r = baseRadius + (wert - mean) * scale;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return [x, y];
  });

  const inner = werte.map((wert, i) => {
    const angle = i * step - Math.PI / 2;
    const r = baseRadius - 20 + (wert - mean) * scale * 0.5;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return [x, y];
  }).reverse(); // Rückwärts, um Ringfläche korrekt zu schließen

  const allPoints = [...outer, ...inner, outer[0]];

  // Hilfsfunktion für weichen Pfad
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

  const pathData = catmullRomToBezier(allPoints);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Rohr-Wanddicken-Anzeige</h2>
      <svg width={size} height={size} className="border rounded-lg shadow bg-white">
        {/* Innenraum */}
        <circle cx={center} cy={center} r={baseRadius - 25} fill="white" />

        {/* Außenring */}
        <path
          d={pathData}
          fill="rgba(0,123,255,0.2)"
          stroke="#007bff"
          strokeWidth="2"
        />

        {/* Hilfskreis (Nominalwand) */}
        <circle
          cx={center}
          cy={center}
          r={baseRadius - 10}
          fill="none"
          stroke="#ccc"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
}
