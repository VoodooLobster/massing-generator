import { AppSettings, ZoningCode } from "../types/index";

export const DUMMY_ZONING_CODES: ZoningCode[] = [
  {
    id: "c1",
    name: "C-1 Neighborhood Commercial",
    frontSetback: 15,
    sideSetback: 10,
    rearSetback: 10,
    maxHeight: 45,
    maxFAR: 1.5,
    maxLotCoverage: 60,
  },
  {
    id: "c2",
    name: "C-2 General Commercial",
    frontSetback: 10,
    sideSetback: 5,
    rearSetback: 5,
    maxHeight: 85,
    maxFAR: 3.0,
    maxLotCoverage: 80,
  },
  {
    id: "c3",
    name: "C-3 Regional Commercial",
    frontSetback: 20,
    sideSetback: 15,
    rearSetback: 15,
    maxHeight: 120,
    maxFAR: 4.5,
    maxLotCoverage: 75,
  },
  {
    id: "mxd",
    name: "Mixed-Use Downtown",
    frontSetback: 0,
    sideSetback: 0,
    rearSetback: 10,
    maxHeight: 150,
    maxFAR: 6.0,
    maxLotCoverage: 100,
  },
  {
    id: "o1",
    name: "O-1 Office Professional",
    frontSetback: 25,
    sideSetback: 20,
    rearSetback: 20,
    maxHeight: 75,
    maxFAR: 2.0,
    maxLotCoverage: 50,
  },
  {
    id: "o2",
    name: "O-2 Office Campus",
    frontSetback: 30,
    sideSetback: 25,
    rearSetback: 25,
    maxHeight: 65,
    maxFAR: 1.8,
    maxLotCoverage: 40,
  },
  {
    id: "r3",
    name: "R-3 Multi-Family Residential",
    frontSetback: 20,
    sideSetback: 15,
    rearSetback: 15,
    maxHeight: 85,
    maxFAR: 2.5,
    maxLotCoverage: 65,
  },
  {
    id: "rt",
    name: "RT Retail/Townhomes",
    frontSetback: 10,
    sideSetback: 8,
    rearSetback: 8,
    maxHeight: 65,
    maxFAR: 2.0,
    maxLotCoverage: 70,
  },
  {
    id: "ind",
    name: "IND Industrial Flex",
    frontSetback: 5,
    sideSetback: 5,
    rearSetback: 5,
    maxHeight: 50,
    maxFAR: 0.8,
    maxLotCoverage: 85,
  },
  {
    id: "pud",
    name: "PUD Planned Unit Dev",
    frontSetback: 15,
    sideSetback: 10,
    rearSetback: 10,
    maxHeight: 100,
    maxFAR: 3.5,
    maxLotCoverage: 70,
  },
];

export const DEFAULT_APP_SETTINGS: AppSettings = {
  zoningCodes: DUMMY_ZONING_CODES,
  buildingDefaults: {
    studioDefaultSF: 450,
    oneBRDefaultSF: 750,
    twoBRDefaultSF: 1100,
    threeBRDefaultSF: 1500,
    parkingRatio: 1.2, // spaces per unit
    commonAreaPercentage: 15, // % of total SF
  },
  appearance: {
    wireframeColor: "#1a1a1a", // dark charcoal
    backgroundColor: "#f8f8f8", // light gray
    accentColor: "#0066cc", // deep blue
    exportResolution: "2k",
  },
};
