import React, { useEffect, useRef, useState } from "react";
import { MapContainer, GeoJSON, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngBoundsLiteral } from "leaflet";
import L from "leaflet";

const FitBounds = ({ bounds }: { bounds: LatLngBoundsLiteral }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [16, 16] });
    }
  }, [map, bounds]);
  return null;
};

interface DistrictMapProps {
  districtName: string;
  onBack: () => void;
  onDistrictChange?: (districtName: string) => void; // Optional, or required if always needed
}


export const DistrictMap = ({
  districtName,
  onBack,
}: {
  districtName: string;
  onBack: () => void;
}) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const geojsonRef = useRef<any>(null);
  const [bounds, setBounds] = useState<LatLngBoundsLiteral>([
    [15.5, 72.5],
    [22.25, 80.5],
  ]);

  useEffect(() => {
    fetch("/maharashtra_subdistricts.geojson")
      .then((res) => res.json())
      .then((data) => {
        const filteredFeatures = data.features.filter(
          (f: any) => f.properties.dtname === districtName
        );
        setGeoJsonData({
          ...data,
          features: filteredFeatures,
        });
        // Compute bounding box (basic way)
        let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
        filteredFeatures.forEach((f: any) => {
          const coords = f.geometry.coordinates.flat(Infinity);
          for (let i = 0; i < coords.length; i += 2) {
            const lng = coords[i];
            const lat = coords[i + 1];
            if (typeof lat === "number" && typeof lng === "number") {
              minLat = Math.min(minLat, lat);
              maxLat = Math.max(maxLat, lat);
              minLng = Math.min(minLng, lng);
              maxLng = Math.max(maxLng, lng);
            }
          }
        });
        setBounds([
          [minLat, minLng],
          [maxLat, maxLng],
        ]);
      });
  }, [districtName]);

  const getSubdistrictName = (feature: any) => feature.properties.sdtname || "Unknown";
  const subdistrictStyle = () => ({
    weight: 2,
    color: "#1d4ed8",
    fillColor: "#93c5fd",
    fillOpacity: 0.6,
    dashArray: "2,4",
    cursor: "pointer",
    //weight: 2,
    //color: selectedDistrict === getDistrictName(feature) ? "#1d4ed8" : "#666",
    //fillColor: selectedDistrict === getDistrictName(feature) ? "#2563eb" : "#dbeafe",
    //fillOpacity: selectedDistrict === getDistrictName(feature) ? 0.7 : 0.35,
    //dashArray: "2,4",
    //cursor: "pointer"
  });

  const onEachSubdistrict = (feature: any, layer: any) => {
    const name = getSubdistrictName(feature);
    layer.bindTooltip(name, { sticky: true, direction: "top" });

    /*layer.on({
          mouseover: function (e: any) {
            e.target.setStyle({
              weight: 4,
              color: "#2563eb",
              fillColor: "#2563eb",
              fillOpacity: 0.7,
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              e.target.bringToFront();
            }
          },
          mouseout: function (e: any) {
            geojsonRef.current?.resetStyle(e.target);
          },
          click: function () {
            //alert("Clicked: " + name); // DEBUG: REMOVE LATER
            //if (onDistrictOpen) onDistrictOpen(name);
          },
        });
    */
  };

  return (
    <div style={{ width: "100%", height: "350px", background: "#fff", borderRadius: "1rem", boxShadow: "0 4px 16px #0001" }}>
      <div className="flex justify-between items-center mb-2 px-2 pt-2">
        <div className="font-bold text-blue-800">{districtName} - Subdistricts</div>
        <button className="text-blue-600 underline" onClick={onBack}>← Back</button>
      </div>
      <MapContainer
        style={{ width: "100%", height: "310px", background: "#fff", borderRadius: "1rem" }}
        bounds={bounds}
        zoom={9}
        minZoom={8}
        maxZoom={13}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}
        doubleClickZoom={false}
        dragging={true}
      >
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={subdistrictStyle}
            onEachFeature={onEachSubdistrict}
          />
        )}
        <FitBounds bounds={bounds} />
      </MapContainer>
    </div>
  );
};
