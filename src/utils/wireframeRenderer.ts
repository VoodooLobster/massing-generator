import { ElevationData } from "../types/index";

export interface WireframeOptions {
  width: number; // SVG width in pixels
  height: number; // SVG height in pixels
  color: string; // line color
  backgroundColor: string;
  showFloorLabels: boolean;
  showDimensions: boolean;
}

/**
 * Render side elevation wireframe as SVG
 */
export function renderElevationWireframe(
  elevationData: ElevationData,
  options: WireframeOptions
): string {
  const { width, height, color, backgroundColor, showFloorLabels } = options;

  // Scaling
  const padding = 40;
  const buildingDrawWidth = width - padding * 2;
  const buildingDrawHeight = height - padding * 2;

  const scaleX = buildingDrawWidth / elevationData.buildingWidth;
  const scaleY = buildingDrawHeight / elevationData.buildingHeight;

  // Building position
  const buildingX = padding;
  const buildingY = padding;
  const drawBuildingWidth = elevationData.buildingWidth * scaleX;
  const drawBuildingHeight = elevationData.buildingHeight * scaleY;

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="${backgroundColor}"/>`;

  // Grid (subtle)
  svg += renderGrid(width, height, color, 0.1);

  // Ground line
  svg += `<line x1="${buildingX}" y1="${buildingY + drawBuildingHeight}" x2="${buildingX + drawBuildingWidth}" y2="${buildingY + drawBuildingHeight}" stroke="${color}" stroke-width="2"/>`;

  // Building outline (base)
  svg += `<rect x="${buildingX}" y="${buildingY}" width="${drawBuildingWidth}" height="${drawBuildingHeight}" fill="none" stroke="${color}" stroke-width="2"/>`;

  // Floor lines
  elevationData.floors.forEach((floor, index) => {
    if (index === 0) return; // skip ground floor line

    const floorY = buildingY + drawBuildingHeight - floor.height * scaleY;
    svg += `<line x1="${buildingX}" y1="${floorY}" x2="${buildingX + drawBuildingWidth}" y2="${floorY}" stroke="${color}" stroke-width="1" opacity="0.5"/>`;

    if (showFloorLabels) {
      svg += `<text x="${buildingX - 30}" y="${floorY + 4}" font-size="12" fill="${color}" text-anchor="end" font-family="monospace">F${floor.floorNum}</text>`;
    }
  });

  // Setbacks (stepped profile)
  if (elevationData.setbackFloors.length > 0) {
    elevationData.setbackFloors.forEach((setback) => {
      const floor = elevationData.floors[setback.floorNum - 1];
      if (!floor) return;

      const floorY = buildingY + drawBuildingHeight - floor.height * scaleY;
      const insetWidth =
        (drawBuildingWidth * setback.insetPercentage) / 2; // inset from both sides

      // Setback step
      svg += `<line x1="${buildingX + insetWidth}" y1="${floorY}" x2="${buildingX + drawBuildingWidth - insetWidth}" y2="${floorY}" stroke="${color}" stroke-width="2"/>`;
    });
  }

  // Dimension annotations
  if (options.showDimensions) {
    // Height dimension
    svg += `<text x="${buildingX + drawBuildingWidth + 15}" y="${buildingY + 15}" font-size="12" fill="${color}" font-family="monospace">${Math.round(elevationData.buildingHeight)}'</text>`;

    // Width dimension
    svg += `<text x="${buildingX + drawBuildingWidth / 2}" y="${buildingY + drawBuildingHeight + 25}" font-size="12" fill="${color}" text-anchor="middle" font-family="monospace">${Math.round(elevationData.buildingWidth)}'</text>`;

    // Floor height
    svg += `<text x="${buildingX - 50}" y="${buildingY + drawBuildingHeight - elevationData.floorHeight * scaleY}" font-size="10" fill="${color}" text-anchor="end" opacity="0.7" font-family="monospace">${elevationData.floorHeight}'</text>`;
  }

  svg += `</svg>`;

  return svg;
}

/**
 * Render subtle background grid
 */
function renderGrid(
  width: number,
  height: number,
  color: string,
  opacity: number
): string {
  const gridSize = 50;
  let grid = "";

  // Vertical lines
  for (let x = 0; x < width; x += gridSize) {
    grid += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${color}" stroke-width="0.5" opacity="${opacity}"/>`;
  }

  // Horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    grid += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${color}" stroke-width="0.5" opacity="${opacity}"/>`;
  }

  return grid;
}

/**
 * Export SVG as PNG (requires canvas in browser)
 */
export function exportWireframeAsPNG(
  svgString: string,
  filename: string
): void {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  canvas.width = 1080;
  canvas.height = 720;

  img.onload = () => {
    ctx?.drawImage(img, 0, 0);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    link.click();
  };

  img.src = "data:image/svg+xml;base64," + btoa(svgString);
}
