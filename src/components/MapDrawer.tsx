import React, { useEffect, useRef, useState } from "react";

interface MapDrawerProps {
  onBoundaryChange: (boundary: any[]) => void;
  onAddressChange: (address: string) => void;
  address?: string; // Add address prop to trigger geocoding
}

export const MapDrawer: React.FC<MapDrawerProps> = ({
  onBoundaryChange,
  onAddressChange,
  address,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const drawingManager = useRef<any>(null);
  const polygon = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Geocode address when it changes
    if (address && map.current && (window as any).google?.maps) {
      const geocoder = new (window as any).google.maps.Geocoder();
      geocoder.geocode({ address }, (results: any[], status: string) => {
        if (status === (window as any).google.maps.GeocoderStatus.OK && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          map.current.setCenter({ lat: lat(), lng: lng() });
          map.current.setZoom(16);
          console.log(`Geocoded address: ${address}`);
        } else {
          console.warn(`Geocoding failed for: ${address}`);
        }
      });
    }
  }, [address]);

    const timeout = setTimeout(() => {
      clearInterval(checkGoogleMaps);
      console.warn("Google Maps took longer to load");
    }, 10000);

    function initializeMap() {
      if (!mapContainer.current) return;

      try {
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

        console.log("✓ Map initialized");
      } catch (error) {
        console.error("Map initialization error:", error);
      }
    }

    return () => {
      clearInterval(checkGoogleMaps);
      clearTimeout(timeout);
    };
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
        <button 
          className={`btn btn-primary ${isDrawing ? "active" : ""}`} 
          onClick={toggleDrawing}
          type="button"
        >
          ✏️ {isDrawing ? "Stop Drawing" : "Draw Lot Boundary"}
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
        Click <strong>Draw Lot Boundary</strong> to sketch your site polygon on the map.
      </p>
    </div>
  );
};
