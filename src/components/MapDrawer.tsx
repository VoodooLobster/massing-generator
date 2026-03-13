import React, { useEffect, useRef, useState } from "react";

interface MapDrawerProps {
  onBoundaryChange: (boundary: any[]) => void;
  onAddressChange: (address: string) => void;
}

export const MapDrawer: React.FC<MapDrawerProps> = ({
  onBoundaryChange,
  onAddressChange,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const drawingManager = useRef<any>(null);
  const polygon = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Load Google Maps API dynamically
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key not found");
      return;
    }

    // Check if Google Maps is already loaded
    if ((window as any).google?.maps) {
      initializeMap();
    } else {
      // Load the script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry`;
      script.async = true;
      script.onload = () => {
        initializeMap();
      };
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
      };
      document.head.appendChild(script);
    }

    function initializeMap() {
      if (!mapContainer.current) return;

      // Initialize map
      map.current = new (window as any).google.maps.Map(mapContainer.current, {
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 15,
        mapTypeId: "satellite",
        styles: [
          {
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      // Initialize Drawing Manager
      drawingManager.current = new (window as any).google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: (window as any).google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            (window as any).google.maps.drawing.OverlayType.POLYGON,
            (window as any).google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        polygonOptions: {
          fillColor: "#0066cc",
          fillOpacity: 0.3,
          strokeColor: "#0066cc",
          strokeWeight: 2,
          editable: true,
          draggable: true,
        },
        rectangleOptions: {
          fillColor: "#0066cc",
          fillOpacity: 0.3,
          strokeColor: "#0066cc",
          strokeWeight: 2,
          editable: true,
          draggable: true,
        },
      });

      drawingManager.current.setMap(map.current);

      // Listen for drawing completion
      drawingManager.current.addListener("overlaycomplete", (event: any) => {
        if (polygon.current) {
          polygon.current.setMap(null);
        }

        polygon.current = event.overlay as any;
        polygon.current.setEditable(true);

        const path = (polygon.current as any).getPath().getArray();
        onBoundaryChange(path);

        (polygon.current as any).getPath().addListener("set_at", () => {
          const updatedPath = (polygon.current as any).getPath().getArray();
          onBoundaryChange(updatedPath);
        });

        drawingManager.current?.setDrawingMode(null);
        setIsDrawing(false);
      });
    }
  }, [onBoundaryChange]);

  const toggleDrawing = () => {
    if (!drawingManager.current || !map.current) return;

    if (isDrawing) {
      drawingManager.current.setDrawingMode(null);
    } else {
      drawingManager.current.setDrawingMode(
        (window as any).google.maps.drawing.OverlayType.POLYGON
      );
    }
    setIsDrawing(!isDrawing);
  };

  const clearBoundary = () => {
    if (polygon.current) {
      polygon.current.setMap(null);
      polygon.current = null;
      onBoundaryChange([]);
    }
  };

  return (
    <div className="map-drawer">
      <div className="map-controls">
        <button className={`btn btn-primary ${isDrawing ? "active" : ""}`}>
          ✏️ Draw Lot Boundary
        </button>
        <button className="btn btn-secondary" onClick={clearBoundary}>
          🗑️ Clear
        </button>
        <input
          type="text"
          placeholder="Address"
          className="address-input"
          onChange={(e) => onAddressChange(e.target.value)}
        />
      </div>
      <div ref={mapContainer} className="map-container"></div>
      <p className="map-hint">
        Click <strong>Draw Lot Boundary</strong> to sketch your site polygon on
        the map.
      </p>
    </div>
  );
};
