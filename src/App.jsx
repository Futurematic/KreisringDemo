import KreisringAbwicklung from "./KreisringAbwicklung";

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
