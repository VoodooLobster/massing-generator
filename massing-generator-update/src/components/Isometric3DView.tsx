import React, { useRef } from "react";
import { MassingOutput, ElevationData, AppSettings, BuildingType } from "../types/index";
import "./Isometric3DView.css";

interface Isometric3DViewProps {
  output: MassingOutput;
  elevationData: ElevationData | null;
  buildingType: BuildingType;
  address: string;
  settings: AppSettings;
}

export const Isometric3DView: React.FC<Isometric3DViewProps> = ({
  output,
  elevationData,
  buildingType,
  address,
  settings,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Get colors for building type
  const getColors = () => {
    const typeKey = buildingType.replace("-", "_") as keyof typeof settings.isometric3D;
    return settings.isometric3D[typeKey] || settings.isometric3D.mixed_use;
  };

  // Generate SVG isometric view
  const generateIsometricSVG = (): string => {
    const colors = getColors();
    const canvasWidth = 680;
    const canvasHeight = 720;
    const baseX = canvasWidth / 2;
    const baseY = 400;

    // Isometric projection parameters
    const xScale = 0.8;
    const yScale = 0.75;
    const depthCosine = 0.6;
    const depthSine = 0.35;

    // Building dimensions (estimated from elevation data)
    const buildingWidth = elevationData?.buildingWidth || 230;
    const buildingHeight = elevationData?.buildingHeight || 300;
    const numFloors = output.totalFloors;
    const floorHeight = buildingHeight / numFloors;

    // Calculate screen coordinates
    const screenWidth = buildingWidth * xScale;
    const screenHeight = buildingHeight * yScale;
    const screenDepth = 100; // Fixed depth for visualization

    // Build SVG
    let svg = `<svg width="100%" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">`;

    // Define gradients
    svg += `<defs>`;
    svg += `<linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors.primary}"/>
      <stop offset="100%" stop-color="${colors.accent}"/>
    </linearGradient>`;
    svg += `<linearGradient id="shadowGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.05"/>
    </linearGradient>`;
    svg += `</defs>`;

    // Draw shadow/ground plane
    const shadowX1 = baseX - screenWidth / 2;
    const shadowY1 = baseY + screenHeight;
    const shadowX2 = shadowX1 + screenWidth;
    const shadowY2 = shadowY1;
    const shadowX3 = shadowX2 + screenDepth * depthCosine;
    const shadowY3 = shadowY2 - screenDepth * depthSine;
    const shadowX4 = shadowX1 + screenDepth * depthCosine;
    const shadowY4 = shadowY1 - screenDepth * depthSine;

    svg += `<polygon points="${shadowX1},${shadowY1} ${shadowX2},${shadowY2} ${shadowX3},${shadowY3} ${shadowX4},${shadowY4}" fill="url(#shadowGradient)" stroke="none"/>`;

    // Draw floors (from bottom to top)
    const floorStartX = baseX - screenWidth / 2;
    for (let i = 0; i < numFloors; i++) {
      const floorY = baseY + screenHeight - (i + 1) * (screenHeight / numFloors);
      const floorScreenHeight = screenHeight / numFloors;

      // FRONT FACE
      svg += `<rect x="${floorStartX}" y="${floorY}" width="${screenWidth}" height="${floorScreenHeight}" fill="url(#primaryGradient)" stroke="${colors.border}" stroke-width="1"/>`;

      // RIGHT SIDE FACE (isometric depth)
      const rightX1 = floorStartX + screenWidth;
      const rightX2 = rightX1 + screenDepth * depthCosine;
      const rightY1 = floorY;
      const rightY2 = floorY + floorScreenHeight;
      const rightY3 = rightY2 - screenDepth * depthSine;
      const rightY4 = rightY1 - screenDepth * depthSine;

      svg += `<polygon points="${rightX1},${rightY1} ${rightX1},${rightY2} ${rightX2},${rightY3} ${rightX2},${rightY4}" fill="${colors.accent}" opacity="0.8" stroke="${colors.border}" stroke-width="1"/>`;

      // TOP FACE
      const topPoints = `${floorStartX},${floorY} ${floorStartX + screenWidth},${floorY} ${floorStartX + screenWidth + screenDepth * depthCosine},${floorY - screenDepth * depthSine} ${floorStartX + screenDepth * depthCosine},${floorY - screenDepth * depthSine}`;
      svg += `<polygon points="${topPoints}" fill="${colors.primary}" opacity="0.5" stroke="${colors.border}" stroke-width="0.5"/>`;

      // Add windows (simple grid)
      const windowCols = 4;
      const windowRows = 1;
      const windowPadding = 15;
      const colWidth = screenWidth / windowCols;
      const rowHeight = floorScreenHeight;

      for (let col = 0; col < windowCols; col++) {
        const windowX = floorStartX + col * colWidth + windowPadding;
        const windowWidth = colWidth - 2 * windowPadding;
        const windowY = floorY + windowPadding;
        const windowHeight = rowHeight - 2 * windowPadding;

        svg += `<rect x="${windowX}" y="${windowY}" width="${windowWidth}" height="${windowHeight}" fill="${colors.glass}" opacity="0.75" stroke="${colors.border}" stroke-width="0.5"/>`;

        // Mullion divider
        const mullionX = windowX + windowWidth / 2;
        svg += `<line x1="${mullionX}" y1="${windowY}" x2="${mullionX}" y2="${windowY + windowHeight}" stroke="${colors.border}" stroke-width="0.5" opacity="0.5"/>`;
      }

      // Floor label
      svg += `<text x="${floorStartX - 40}" y="${floorY + 20}" font-size="11px" font-weight="500" text-anchor="end" fill="${colors.text}">FLOOR ${i + 1}</text>`;
      svg += `<text x="${floorStartX - 40}" y="${floorY + 35}" font-size="10px" text-anchor="end" fill="${colors.text}">${Math.round(floorHeight)} ft</text>`;
    }

    // Title & info
    svg += `<text x="20" y="40" font-size="14px" font-weight="600" fill="${colors.text}">${address}</text>`;
    svg += `<text x="20" y="60" font-size="12px" fill="${colors.text}">${output.totalBuildingSF.toLocaleString()} SF | ${output.totalFloors} Floors</text>`;

    // Dimension: Width
    svg += `<line x1="${floorStartX}" y1="${baseY + screenHeight + 30}" x2="${floorStartX + screenWidth}" y2="${baseY + screenHeight + 30}" stroke="${colors.border}" stroke-width="1" opacity="0.7"/>`;
    svg += `<text x="${floorStartX + screenWidth / 2}" y="${baseY + screenHeight + 55}" font-size="10px" text-anchor="middle" fill="${colors.text}">${Math.round(buildingWidth)} ft</text>`;

    // Dimension: Height (left side)
    svg += `<line x1="${floorStartX - 30}" y1="${baseY}" x2="${floorStartX - 30}" y2="${baseY + screenHeight}" stroke="${colors.border}" stroke-width="1" opacity="0.7"/>`;
    svg += `<text x="${floorStartX - 50}" y="${baseY + screenHeight / 2}" font-size="10px" text-anchor="end" fill="${colors.text}">${Math.round(buildingHeight)} ft</text>`;

    svg += `</svg>`;
    return svg;
  };

  const svgContent = generateIsometricSVG();

  // Download handlers
  const downloadSVG = () => {
    const element = document.createElement("a");
    const file = new Blob([svgContent], { type: "image/svg+xml" });
    element.href = URL.createObjectURL(file);
    element.download = `massing-${Date.now()}.svg`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPNG = async () => {
    // Use html2canvas library (would need to install)
    alert("PNG export coming soon - requires html2canvas library");
  };

  const downloadPDF = async () => {
    // Use jsPDF library (would need to install)
    alert("PDF export coming soon - requires jsPDF library");
  };

  return (
    <div className="isometric-3d-view">
      <div className="isometric-header">
        <h3>Isometric 3D Massing View</h3>
        <div className="isometric-actions">
          <button onClick={downloadSVG} className="btn btn-small">
            ⬇️ SVG
          </button>
          <button onClick={downloadPNG} className="btn btn-small">
            ⬇️ PNG
          </button>
          <button onClick={downloadPDF} className="btn btn-small">
            ⬇️ PDF
          </button>
        </div>
      </div>
      <div
        className="isometric-canvas"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        ref={svgRef}
      />
    </div>
  );
};
