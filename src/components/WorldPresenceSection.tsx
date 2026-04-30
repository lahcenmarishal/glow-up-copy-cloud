import { useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { Plus, Minus, Home, Maximize2 } from "lucide-react";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countries: { name: string; coords: [number, number] }[] = [
  { name: "France", coords: [2.5, 46.6] },
  { name: "Italie", coords: [12.6, 42.8] },
  { name: "Russie", coords: [90, 61.5] },
  { name: "Allemagne", coords: [10.4, 51.2] },
  { name: "Espagne", coords: [-3.7, 40.4] },
  { name: "Grèce", coords: [22.0, 39.1] },
  { name: "Pays-Bas", coords: [5.3, 52.1] },
  { name: "Belgique", coords: [4.5, 50.5] },
  { name: "Mexique", coords: [-102.5, 23.6] },
  { name: "États-Unis", coords: [-98.6, 39.8] },
  { name: "Vietnam", coords: [107.8, 16.0] },
  { name: "Inde", coords: [79.0, 22.0] },
  { name: "Malaisie", coords: [102.0, 4.2] },
  { name: "Indonésie", coords: [117.0, -2.5] },
  { name: "Brésil", coords: [-51.9, -14.2] },
  { name: "Ukraine", coords: [31.2, 48.4] },
  { name: "Irlande", coords: [-8.2, 53.4] },
  { name: "Turquie", coords: [35.2, 38.9] },
  { name: "Iran", coords: [53.7, 32.4] },
  { name: "Kazakhstan", coords: [66.9, 48.0] },
  { name: "Australie", coords: [133.8, -25.3] },
  { name: "Nouvelle-Zélande", coords: [174.0, -41.0] },
  { name: "Suisse", coords: [8.2, 46.8] },
  { name: "Afrique du Sud", coords: [22.9, -30.6] },
  { name: "Maroc", coords: [-7.1, 31.8] },
];

const WorldPresenceSection = () => {
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [15, 20],
    zoom: 1,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    if (position.zoom >= 8) return;
    setPosition((p) => ({ ...p, zoom: p.zoom * 1.5 }));
  };
  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((p) => ({ ...p, zoom: p.zoom / 1.5 }));
  };
  const handleReset = () => setPosition({ coordinates: [15, 20], zoom: 1 });

  const handleFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <section className="bg-foreground py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-background uppercase tracking-wide">
            Présence mondiale Impulse
          </h2>
          <p className="text-background/70 mt-3 max-w-2xl mx-auto">
            Découvrez les pays où la marque Impulse est présente à travers ses
            centres et partenaires.
          </p>
        </div>

        <div
          ref={wrapperRef}
          className="relative rounded-lg overflow-hidden border border-background/10 shadow-2xl bg-black"
        >
          <ComposableMap
            projectionConfig={{ scale: 155 }}
            width={980}
            height={500}
            style={{ width: "100%", height: "auto", background: "#000000" }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={(pos) =>
                setPosition({ coordinates: pos.coordinates as [number, number], zoom: pos.zoom })
              }
              maxZoom={8}
              minZoom={1}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "#9ca3af",
                          stroke: "#ffffff",
                          strokeWidth: 0.4,
                          outline: "none",
                        },
                        hover: {
                          fill: "#b5bbc4",
                          stroke: "#ffffff",
                          strokeWidth: 0.4,
                          outline: "none",
                        },
                        pressed: {
                          fill: "#9ca3af",
                          outline: "none",
                        },
                      }}
                    />
                  ))
                }
              </Geographies>

              {countries.map((c) => (
                <Marker key={c.name} coordinates={c.coords}>
                  <circle
                    r={5 / Math.sqrt(position.zoom)}
                    fill="#dc2626"
                    stroke="#ffffff"
                    strokeWidth={1.2 / Math.sqrt(position.zoom)}
                  />
                  <title>{c.name}</title>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Controls below the map */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            aria-label="Zoom avant"
            onClick={handleZoomIn}
            className="h-10 w-10 inline-flex items-center justify-center rounded-md bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            aria-label="Zoom arrière"
            onClick={handleZoomOut}
            className="h-10 w-10 inline-flex items-center justify-center rounded-md bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            aria-label="Réinitialiser"
            onClick={handleReset}
            className="h-10 w-10 inline-flex items-center justify-center rounded-md bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
          >
            <Home className="h-4 w-4" />
          </button>
          <button
            aria-label="Plein écran"
            onClick={handleFullscreen}
            className="h-10 w-10 inline-flex items-center justify-center rounded-md bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-background/80 text-sm">
          <span className="inline-block w-3 h-3 rounded-full bg-primary border-2 border-white" />
          Centres et partenaires Impulse
        </div>
      </div>
    </section>
  );
};

export default WorldPresenceSection;
