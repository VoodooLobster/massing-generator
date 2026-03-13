import { MassingInputs, MassingOutput, ElevationData } from "../types/index";

/**
 * Calculate massing output from inputs
 * Based on FAR (Floor Area Ratio) and FLR (Floor-to-Land Ratio)
 */
export function calculateMassing(inputs: MassingInputs): MassingOutput {
  const lotSize = inputs.siteData.lotSize;

  // Total building SF based on FAR
  const totalBuildingSFByFAR = lotSize * inputs.targetFAR;

  // Total building SF based on FLR
  const totalBuildingSFByFLR = lotSize * inputs.targetFLR;

  // Use the more conservative (lower) of the two
  const totalBuildingSF = Math.min(totalBuildingSFByFAR, totalBuildingSFByFLR);

  // Calculate number of floors
  const avgFloorSF = totalBuildingSF / inputs.numFloors;

  // Calculate parking spaces
  const parkingSpaces = Math.ceil(inputs.parkingSpacesSF / inputs.parkingSFPerSpace);

  // Unit counts (if residential)
  const unitCounts: Record<string, number> = {
    studio: 0,
    "1br": 0,
    "2br": 0,
    "3br": 0,
  };

  let totalResidentialUnits = 0;
  inputs.units.forEach((unit) => {
    unitCounts[unit.type] = unit.count;
    totalResidentialUnits += unit.count;
  });

  // Average SF per unit
  const totalResidentialSF = inputs.units.reduce(
    (sum, u) => sum + u.count * u.defaultSF,
    0
  );
  const unitAverageSF =
    totalResidentialUnits > 0 ? totalResidentialSF / totalResidentialUnits : 0;

  // Achieved ratios
  const farAchieved = totalBuildingSF / lotSize;
  const flrAchieved = totalBuildingSF / lotSize; // FLR = FAR in this simplified model

  // Compliance notes
  const complianceNotes: string[] = [];
  if (farAchieved > inputs.targetFAR) {
    complianceNotes.push(
      `⚠️ FAR exceeds target (${farAchieved.toFixed(2)} vs ${inputs.targetFAR})`
    );
  }
  if (farAchieved <= inputs.targetFAR) {
    complianceNotes.push(`✓ FAR compliant (${farAchieved.toFixed(2)})`);
  }

  return {
    totalBuildingSF: Math.round(totalBuildingSF),
    totalFloors: inputs.numFloors,
    parkingSpaces,
    unitCounts,
    unitAverageSF: Math.round(unitAverageSF),
    floorAverageSF: Math.round(avgFloorSF),
    farAchieved,
    flrAchieved,
    residentialUnits: totalResidentialUnits,
    officeUnits: Math.round(inputs.officeSF / 250), // rough estimate: 250 SF per office
    retailUnits: 1, // simplified
    complianceNotes,
  };
}

/**
 * Calculate elevation wireframe data for side view rendering
 */
export function calculateElevation(
  inputs: MassingInputs,
  output: MassingOutput,
  zoning: any
): ElevationData {
  const floorHeight = 12; // feet per floor (typical commercial)
  const totalHeight = output.totalFloors * floorHeight;

  // Building footprint width (approximate)
  const lotAreaSqFt = inputs.siteData.lotSize;
  const lotWidthFeet = Math.sqrt(lotAreaSqFt * 0.8); // assume rectangular, 80% aspect ratio
  const buildingWidth = lotWidthFeet - zoning.frontSetback - zoning.rearSetback;

  // Floors array
  const floors = Array.from({ length: output.totalFloors }, (_, i) => ({
    floorNum: i + 1,
    height: (i + 1) * floorHeight,
    width: buildingWidth,
  }));

  // Setback logic: apply 20% inset starting at floor 2/3 of building height
  const setbackStartFloor = Math.ceil(output.totalFloors * 0.66);
  const setbackFloors = floors
    .filter((f) => f.floorNum >= setbackStartFloor)
    .map((f) => ({
      floorNum: f.floorNum,
      insetPercentage: (f.floorNum - setbackStartFloor + 1) * 0.1, // 10% per floor after setback start
    }));

  return {
    buildingWidth,
    buildingHeight: totalHeight,
    floorHeight,
    setbackFloors,
    floors,
  };
}

/**
 * Estimate lot dimensions from drawn polygon
 */
export function estimateLotSize(boundary: google.maps.LatLng[]): number {
  if (boundary.length < 3) return 0;

  // Simplified: use bounding box
  let minLat = boundary[0].lat();
  let maxLat = boundary[0].lat();
  let minLng = boundary[0].lng();
  let maxLng = boundary[0].lng();

  boundary.forEach((point) => {
    minLat = Math.min(minLat, point.lat());
    maxLat = Math.max(maxLat, point.lat());
    minLng = Math.min(minLng, point.lng());
    maxLng = Math.max(maxLng, point.lng());
  });

  // Rough conversion: 1 degree lat ≈ 364,000 feet, 1 degree lng ≈ 288,000 feet (varies by latitude)
  const latFeet = (maxLat - minLat) * 364000;
  const lngFeet = (maxLng - minLng) * 288000;

  return Math.round(latFeet * lngFeet);
}
