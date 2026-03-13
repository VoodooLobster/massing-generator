// Zoning & Site Configuration
export interface ZoningCode {
  id: string;
  name: string;
  frontSetback: number; // feet
  sideSetback: number; // feet
  rearSetback: number; // feet
  maxHeight: number; // feet
  maxFAR: number;
  maxLotCoverage: number; // percentage 0-100
}

export interface SiteData {
  address: string;
  lotSize: number; // square feet
  zonigCodeId: string;
  drawnBoundary: any[]; // polygon from map draw
}

// Building Parameters
export type BuildingType = "residential" | "office" | "retail" | "mixed-use";

export interface UnitConfig {
  type: "studio" | "1br" | "2br" | "3br";
  count: number;
  defaultSF: number; // default square feet per unit
}

export interface MassingInputs {
  siteData: SiteData;
  buildingType: BuildingType;
  targetFLR: number; // Floor-to-Land ratio
  targetFAR: number; // Floor Area Ratio
  numFloors: number;
  residentialSF: number;
  officeSF: number;
  retailSF: number;
  commonAreasSF: number;
  parkingSpacesSF: number; // total
  parkingSFPerSpace: number; // 300-500, default 350
  units: UnitConfig[]; // residential units breakdown
}

// Output Data
export interface MassingOutput {
  totalBuildingSF: number;
  totalFloors: number;
  parkingSpaces: number;
  unitCounts: Record<string, number>;
  unitAverageSF: number;
  floorAverageSF: number;
  farAchieved: number;
  flrAchieved: number;
  residentialUnits: number;
  officeUnits: number;
  retailUnits: number;
  complianceNotes: string[];
}

// Elevation Wireframe
export interface ElevationData {
  buildingWidth: number; // feet
  buildingHeight: number; // feet
  floorHeight: number; // feet
  setbackFloors: Array<{
    floorNum: number;
    insetPercentage: number; // how much inset from base
  }>;
  floors: Array<{
    floorNum: number;
    height: number; // feet above grade
    width: number; // feet
  }>;
}

// Settings
export interface AppSettings {
  zoningCodes: ZoningCode[];
  buildingDefaults: {
    studioDefaultSF: number;
    oneBRDefaultSF: number;
    twoBRDefaultSF: number;
    threeBRDefaultSF: number;
    parkingRatio: number; // spaces per unit
    commonAreaPercentage: number; // of total SF
  };
  appearance: {
    wireframeColor: string;
    backgroundColor: string;
    accentColor: string;
    exportResolution: "1080p" | "2k" | "4k";
  };
}
