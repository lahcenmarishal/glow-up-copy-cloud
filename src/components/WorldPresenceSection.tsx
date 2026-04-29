import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus, Minus, Maximize2 } from "lucide-react";

// Equirectangular projection: lat/lng -> percentages on the map image
const project = (lat: number, lng: number) => ({
  left: ((lng + 180) / 360) * 100,
  top: ((90 - lat) / 180) * 100,
});

const countries: { name: string; lat: number; lng: number }[] = [
  { name: "France", lat: 46.6, lng: 2.5 },
  { name: "Italie", lat: 42.8, lng: 12.6 },
  { name: "Russie", lat: 61.5, lng: 90 },
  { name: "Allemagne", lat: 51.2, lng: 10.4 },
  { name: "Espagne", lat: 40.4, lng: -3.7 },
  { name: "Grèce", lat: 39.1, lng: 22.0 },
  { name: "Pays-Bas", lat: 52.1, lng: 5.3 },
  { name: "Belgique", lat: 50.5, lng: 4.5 },
  { name: "Mexique", lat: 23.6, lng: -102.5 },
  { name: "États-Unis", lat: 39.8, lng: -98.6 },
  { name: "Vietnam", lat: 16.0, lng: 107.8 },
  { name: "Inde", lat: 22.0, lng: 79.0 },
  { name: "Malaisie", lat: 4.2, lng: 102.0 },
  { name: "Indonésie", lat: -2.5, lng: 117.0 },
  { name: "Brésil", lat: -14.2, lng: -51.9 },
  { name: "Ukraine", lat: 48.4, lng: 31.2 },
  { name: "Irlande", lat: 53.4, lng: -8.2 },
  { name: "Turquie", lat: 38.9, lng: 35.2 },
  { name: "Iran", lat: 32.4, lng: 53.7 },
  { name: "Kazakhstan", lat: 48.0, lng: 66.9 },
  { name: "Australie", lat: -25.3, lng: 133.8 },
  { name: "Nouvelle-Zélande", lat: -41.0, lng: 174.0 },
  { name: "Suisse", lat: 46.8, lng: 8.2 },
  { name: "Afrique du Sud", lat: -30.6, lng: 22.9 },
  { name: "Maroc", lat: 31.8, lng: -7.1 },
];

// Public domain equirectangular world map (Wikimedia)
const WORLD_MAP_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1280px-Equirectangular_projection_SW.jpg";

const WorldPresenceSection = () => {
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

        <div className="relative rounded-lg overflow-hidden border border-background/10 shadow-2xl bg-[#0a1628]">
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={6}
            wheel={{ step: 0.2 }}
            doubleClick={{ step: 0.7 }}
            panning={{ velocityDisabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  <button
                    aria-label="Zoom in"
                    onClick={() => zoomIn()}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Zoom out"
                    onClick={() => zoomOut()}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-md"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Reset"
                    onClick={() => resetTransform()}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-md bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-md"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>

                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "auto" }}
                  contentStyle={{ width: "100%" }}
                >
                  <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
                    <img
                      src={WORLD_MAP_SRC}
                      alt="Carte du monde - présence Impulse"
                      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                      draggable={false}
                      loading="lazy"
                    />
                    {countries.map((c) => {
                      const pos = project(c.lat, c.lng);
                      return (
                        <div
                          key={c.name}
                          className="absolute group"
                          style={{
                            left: `${pos.left}%`,
                            top: `${pos.top}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <span className="block w-3 h-3 rounded-full bg-[#22c55e] border-2 border-white shadow-[0_0_0_2px_rgba(34,197,94,0.4)] animate-pulse" />
                          <span className="absolute left-1/2 -translate-x-1/2 -top-7 whitespace-nowrap rounded bg-background text-foreground text-[10px] font-semibold px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                            {c.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 text-background/80 text-sm">
          <span className="inline-block w-3 h-3 rounded-full bg-[#22c55e] border-2 border-white" />
          Centres et partenaires Impulse — utilisez la molette ou les boutons +/− pour zoomer
        </div>
      </div>
    </section>
  );
};

export default WorldPresenceSection;
