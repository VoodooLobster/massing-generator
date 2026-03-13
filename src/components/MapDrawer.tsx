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
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new (window as any).google.maps.Map(mapContainer.current, {
      center: { lat: 40.7128, lng: -74.006 }, // Default to NYC
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
    drawingManager.current.addListener(
      "overlaycomplete",
      (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (polygon.current) {
          polygon.current.setMap(null);
        }

        polygon.current = event.overlay as google.maps.Polygon;
        polygon.current.setEditable(true);

        // Get boundary and emit
        const path = (polygon.current as google.maps.Polygon)
          .getPath()
          .getArray();
        onBoundaryChange(path);

        // Update on edit
        const pathListener = (polygon.current as google.maps.Polygon)
          .getPath()
          .addListener("set_at", () => {
            const updatedPath = (polygon.current as google.maps.Polygon)
              .getPath()
              .getArray();
            onBoundaryChange(updatedPath);
          });

        // Stop drawing
        drawingManager.current?.setDrawingMode(null);
        setIsDrawing(false);
      }
    );

    // Cleanup
    return () => {
      if (drawingManager.current) {
        drawingManager.current.setMap(null);
      }
    };
  }, [onBoundaryChange]);

  const toggleDrawing = () => {
    if (!drawingManager.current || !map.current) return;

    if (isDrawing) {
      drawingManager.current.setDrawingMode(null);
    } else {
      drawingManager.current.setDrawingMode(
        google.maps.drawing.OverlayType.POLYGON
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
