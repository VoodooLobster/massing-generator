import React, { useMemo } from "react";
import { ElevationData, AppSettings } from "../types/index";
import {
  renderElevationWireframe,
  WireframeOptions,
} from "../utils/wireframeRenderer";

interface ElevationPreviewProps {
  elevationData: ElevationData;
  settings: AppSettings;
}

export const ElevationPreview: React.FC<ElevationPreviewProps> = ({
  elevationData,
  settings,
}) => {
  const svgString = useMemo(() => {
    const options: WireframeOptions = {
      width: 800,
      height: 600,
      color: settings.appearance.wireframeColor,
      backgroundColor: settings.appearance.backgroundColor,
      showFloorLabels: true,
      showDimensions: true,
    };

    return renderElevationWireframe(elevationData, options);
  }, [elevationData, settings.appearance]);

  const handleExport = () => {
    const svg = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);
    const link = document.createElement("a");
    link.href = url;
    link.download = "massing-elevation.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1920;
    canvas.height = 1440;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "massing-elevation.png";
      link.click();
    };

    img.src =
      "data:image/svg+xml;base64," + btoa(svgString);
  };

  return (
    <div className="elevation-preview">
      <div className="preview-controls">
        <button className="btn btn-secondary" onClick={handleExport}>
          ↓ SVG
        </button>
        <button className="btn btn-secondary" onClick={handleExportPNG}>
          ↓ PNG
        </button>
      </div>
      <div
        className="preview-canvas"
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
      <p className="preview-hint">
        Side elevation showing setbacks, floor divisions, and height. Export as SVG for AI rendering tools (Canva, Midjourney, etc.).
      </p>
    </div>
  );
};
