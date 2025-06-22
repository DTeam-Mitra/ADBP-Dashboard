import React, { useEffect, useRef, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
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

export const MaharashtraMap = ({
  selectedDistrict = null,
  onDistrictOpen,
  height = "350px"
}) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const geojsonRef = useRef<any>(null);

  useEffect(() => {
    fetch("/maharashtra_districts.geojson")
      .then(res => res.json())
      .then(setGeoJsonData);
  }, []);

  const bounds: LatLngBoundsLiteral = [
    [15.5, 72.5],
    [22.25, 80.5],
  ];

  const getDistrictName = (feature: any) => feature.properties.dtname;

  const districtStyle = (feature: any) => ({
    weight: 2,
    color: selectedDistrict === getDistrictName(feature) ? "#1d4ed8" : "#666",
    fillColor: selectedDistrict === getDistrictName(feature) ? "#2563eb" : "#dbeafe",
    fillOpacity: selectedDistrict === getDistrictName(feature) ? 0.7 : 0.35,
    dashArray: "2,4",
    cursor: "pointer"
  });

  const onEachDistrict = (feature: any, layer: any) => {
    const name = getDistrictName(feature);
    layer.bindTooltip(name, { sticky: true, direction: "top" });

    layer.on({
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
      click: function (e: any) {
        //alert("Clicked: " + name); // DEBUG: REMOVE LATER
        if (onDistrictOpen) onDistrictOpen(name);
        geojsonRef.current?.setStyle(e.target);
      }
    });
  };

  return (
    <div style={{ width: "100%", height, background: "#fff", borderRadius: "1rem", boxShadow: "0 4px 16px #0001" }}>
      <MapContainer
        style={{ width: "100%", height: "100%", background: "#fff", borderRadius: "1rem" }}
        bounds={bounds}
        zoom={7}
        minZoom={6}
        maxZoom={10}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}
        doubleClickZoom={false}
        dragging={true}
      >
        {geoJsonData && (
          <GeoJSON
            ref={geojsonRef}
            data={geoJsonData}
            style={districtStyle}
            onEachFeature={onEachDistrict}
          />
        )}
        <FitBounds bounds={bounds} />
      </MapContainer>
    </div>
  );
};
