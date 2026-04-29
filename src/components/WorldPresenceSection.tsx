import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const countries: { name: string; coords: [number, number] }[] = [
  { name: "France", coords: [46.6, 2.5] },
  { name: "Italie", coords: [42.8, 12.6] },
  { name: "Russie", coords: [61.5, 105.3] },
  { name: "Allemagne", coords: [51.2, 10.4] },
  { name: "Espagne", coords: [40.4, -3.7] },
  { name: "Grèce", coords: [39.1, 22.0] },
  { name: "Pays-Bas", coords: [52.1, 5.3] },
  { name: "Belgique", coords: [50.5, 4.5] },
  { name: "Mexique", coords: [23.6, -102.5] },
  { name: "États-Unis", coords: [39.8, -98.6] },
  { name: "Vietnam", coords: [16.0, 107.8] },
  { name: "Inde", coords: [22.0, 79.0] },
  { name: "Malaisie", coords: [4.2, 102.0] },
  { name: "Indonésie", coords: [-2.5, 117.0] },
  { name: "Brésil", coords: [-14.2, -51.9] },
  { name: "Ukraine", coords: [48.4, 31.2] },
  { name: "Irlande", coords: [53.4, -8.2] },
  { name: "Turquie", coords: [38.9, 35.2] },
  { name: "Iran", coords: [32.4, 53.7] },
  { name: "Kazakhstan", coords: [48.0, 66.9] },
  { name: "Australie", coords: [-25.3, 133.8] },
  { name: "Nouvelle-Zélande", coords: [-41.0, 174.0] },
  { name: "Suisse", coords: [46.8, 8.2] },
  { name: "Afrique du Sud", coords: [-30.6, 22.9] },
  { name: "Maroc", coords: [31.8, -7.1] },
];

const WorldPresenceSection = () => {
  useEffect(() => {
    // Ensure Leaflet's CSS is applied; container needs a fixed height
  }, []);

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

        <div className="relative rounded-lg overflow-hidden border border-background/10 shadow-2xl">
          <MapContainer
            center={[25, 15]}
            zoom={2}
            scrollWheelZoom={false}
            style={{ height: "560px", width: "100%", background: "#0a0a0a" }}
            worldCopyJump
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {countries.map((c) => (
              <CircleMarker
                key={c.name}
                center={c.coords}
                radius={7}
                pathOptions={{
                  color: "#16a34a",
                  fillColor: "#22c55e",
                  fillOpacity: 0.9,
                  weight: 2,
                }}
              >
                <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                  <span className="font-semibold">{c.name}</span>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 text-background/80 text-sm">
          <span className="inline-block w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#16a34a]" />
          Centres et partenaires Impulse
        </div>
      </div>
    </section>
  );
};

export default WorldPresenceSection;
