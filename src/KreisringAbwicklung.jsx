import React from "react";

function KreisringAbwicklung({ werte, variant = "segment" }) {
  const size = 300;
  const center = size / 2;
  const baseRadius = size / 2 - 20;
  const n = werte.length;
  const mean = werte.reduce((a, b) => a + b, 0) / n;
  const scale = 15;
  const step = (2 * Math.PI) / n;

  // Erweitere das Array zyklisch für geschlossene Kurve
  const extendedWerte = [
    werte[n - 1],        // Letzter Wert
    ...werte,             // Alle Werte
    werte[0],             // Erster Wert
    werte[1]              // Zweiter Wert
  ];

  // Berechne Punkte für äußere Kontur
  const outerPoints = extendedWerte.map((wert, i) => {
    const actualIndex = i - 1; // Verschiebe Index wegen dem extra Punkt am Anfang
    const angle = actualIndex * step - Math.PI / 2;
    const r = baseRadius + (wert - mean) * scale;
    return [
      center + r * Math.cos(angle),
      center + r * Math.sin(angle),
    ];
  });

  // Berechne Punkte für innere Kontur
  const innerPoints = extendedWerte.map((wert, i) => {
    const actualIndex = i - 1;
    const angle = actualIndex * step - Math.PI / 2;
    const r = baseRadius - 20 + (wert - mean) * scale * 0.5;
    return [
      center + r * Math.cos(angle),
      center + r * Math.sin(angle),
    ];
  });

  // Catmull-Rom zu Bézier - nur für die n Hauptsegmente
  const createSmoothPath = (points) => {
    const segments = [];
    
    // Starte bei Index 1 (nach dem extra Punkt) und gehe n Schritte
    for (let i = 1; i <= n; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2];

      // Sicherheitscheck
      if (!p0 || !p1 || !p2 || !p3) continue;

      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;

      segments.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`);
    }
    
    return segments;
  };

  const outerSegments = createSmoothPath(outerPoints);
  const innerSegments = createSmoothPath(innerPoints);

  // Kombiniere äußeren und inneren Pfad zu einem geschlossenen Ring
  const startPoint = outerPoints[1]; // Erster echter Punkt
  
  // Äußerer Pfad im Uhrzeigersinn
  const outerPath = `M ${startPoint[0]},${startPoint[1]} ${outerSegments.join(" ")}`;
  
  // Verbindung zum inneren Pfad
  const connectionToInner = `L ${innerPoints[n + 1][0]},${innerPoints[n + 1][1]}`;
  
  // Innerer Pfad gegen den Uhrzeigersinn (reversed)
  const innerSegmentsReversed = [];
  for (let i = n; i >= 1; i--) {
    const p0 = innerPoints[i + 2];
    const p1 = innerPoints[i + 1];
    const p2 = innerPoints[i];
    const p3 = innerPoints[i - 1];

    if (!p0 || !p1 || !p2 || !p3) continue;

    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;

    innerSegmentsReversed.push(`C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`);
  }

  const pathData = `${outerPath} ${connectionToInner} ${innerSegmentsReversed.join(" ")} Z`;

  // Farbverlauf
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

      <circle cx={center} cy={center} r={baseRadius - 30} fill="white" />

      <path
        d={pathData}
        fill={`url(#${gradientId})`}
        stroke="#007bff"
        strokeWidth="2"
      />

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

export default function App() {
  const werte = [3.0, 3.1, 3.3, 2.9, 2.7, 2.8, 3.2, 3.0];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Vergleich Wanddicken-Anzeige</h1>
      <div className="flex gap-8">
        <div className="flex flex-col items-center">
          <h2 className="text-lg mb-2">Segmentierte Darstellung</h2>
          <KreisringAbwicklung werte={werte} variant="segment" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg mb-2">Glatte Verlauf-Darstellung</h2>
          <KreisringAbwicklung werte={werte} variant="smooth" />
        </div>
      </div>
    </div>
  );
}