import React, { useState, useEffect } from "react";
import "./styles/globals.css";
import { MapDrawer } from "./components/MapDrawer";
import { FormInputs } from "./components/FormInputs";
import { ElevationPreview } from "./components/ElevationPreview";
import { DataSheet } from "./components/DataSheet";
import { SettingsPanel } from "./components/SettingsPanel";
import {
  MassingInputs,
  MassingOutput,
  ElevationData,
  AppSettings,
  BuildingType,
  UnitConfig,
} from "./types/index";
import { calculateMassing, calculateElevation } from "./utils/massingCalculator";
import { DEFAULT_APP_SETTINGS } from "./utils/settings";

export function App() {
  // Settings state
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  // Map & site data
  const [drawnBoundary, setDrawnBoundary] = useState<any[]>([]);
  const [address, setAddress] = useState("123 Commercial Ave, Downtown City");
  const [manualLotSize, setManualLotSize] = useState(50000); // sq ft

  // Calculate lot size from drawn boundary
  const lotSize = drawnBoundary.length > 0 
    ? calculateLotSizeFromBoundary(drawnBoundary)
    : manualLotSize;

  function calculateLotSizeFromBoundary(boundary: any[]): number {
    if (boundary.length < 3) return manualLotSize;

    // Simple lat/lng to feet conversion
    let minLat = boundary[0].lat?.() || boundary[0].lat;
    let maxLat = minLat;
    let minLng = boundary[0].lng?.() || boundary[0].lng;
    let maxLng = minLng;

    boundary.forEach((point: any) => {
      const lat = point.lat?.() || point.lat;
      const lng = point.lng?.() || point.lng;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    });

    // Rough conversion: 1 degree lat ≈ 364,000 feet, 1 degree lng ≈ 288,000 feet
    const latFeet = (maxLat - minLat) * 364000;
    const lngFeet = (maxLng - minLng) * 288000;
    const estimatedSize = Math.round(latFeet * lngFeet);

    return estimatedSize > 0 ? estimatedSize : manualLotSize;
  }

  // Building inputs
  const [zoningCodeId, setZoningCodeId] = useState("c2");
  const [buildingType, setBuildingType] = useState<BuildingType>("mixed-use");
  const [numFloors, setNumFloors] = useState(5);
  const [targetFAR, setTargetFAR] = useState(3.0);
  const [targetFLR, setTargetFLR] = useState(3.0);

  // Program mix (SF)
  const [residentialSF, setResidentialSF] = useState(80000);
  const [officeSF, setOfficeSF] = useState(20000);
  const [retailSF, setRetailSF] = useState(10000);
  const [commonAreasSF, setCommonAreasSF] = useState(15000);
  const [parkingSpacesSF, setParkingSpacesSF] = useState(45000);
  const [parkingSFPerSpace, setParkingSFPerSpace] = useState(350);

  // Unit breakdown (residential)
  const [units, setUnits] = useState<UnitConfig[]>([
    { type: "studio", count: 20, defaultSF: 450 },
    { type: "1br", count: 40, defaultSF: 750 },
    { type: "2br", count: 30, defaultSF: 1100 },
    { type: "3br", count: 10, defaultSF: 1500 },
  ]);

  // Computed outputs
  const [massingOutput, setMassingOutput] = useState<MassingOutput | null>(null);
  const [elevationData, setElevationData] = useState<ElevationData | null>(null);

  // Recalculate when inputs change
  useEffect(() => {
    const zoningCode = settings.zoningCodes.find((z) => z.id === zoningCodeId);
    if (!zoningCode) return;

    const inputs: MassingInputs = {
      siteData: {
        address,
        lotSize: lotSize,
        zonigCodeId: zoningCodeId,
        drawnBoundary,
      },
      buildingType,
      targetFLR,
      targetFAR,
      numFloors,
      residentialSF,
      officeSF,
      retailSF,
      commonAreasSF,
      parkingSpacesSF,
      parkingSFPerSpace,
      units,
    };

    const output = calculateMassing(inputs);
    setMassingOutput(output);

    const elevation = calculateElevation(inputs, output, zoningCode);
    setElevationData(elevation);
  }, [
    zoningCodeId,
    buildingType,
    targetFAR,
    targetFLR,
    numFloors,
    residentialSF,
    officeSF,
    retailSF,
    commonAreasSF,
    parkingSpacesSF,
    parkingSFPerSpace,
    units,
    address,
    manualLotSize,
    drawnBoundary,
    settings,
  ]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>Massing Study Generator</h1>
          <p>Commercial Real Estate Development Concept Tool</p>
        </div>
        <button
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️ Settings
        </button>
      </header>

      {/* Main Content */}
      <div className="app-main">
        {/* Left Panel: Inputs */}
        <div className="left-panel">
          {/* Map Drawer */}
          <section className="panel-section">
            <h2>Site Location & Boundary</h2>
            <MapDrawer
              onBoundaryChange={setDrawnBoundary}
              onAddressChange={setAddress}
            />
          </section>

          {/* Form Inputs */}
          <section className="panel-section">
            <h2>Building Parameters</h2>
            <FormInputs
              zoningCodes={settings.zoningCodes}
              zoningCodeId={zoningCodeId}
              onZoningChange={setZoningCodeId}
              buildingType={buildingType}
              onBuildingTypeChange={setBuildingType}
              numFloors={numFloors}
              onNumFloorsChange={setNumFloors}
              targetFAR={targetFAR}
              onFARChange={setTargetFAR}
              targetFLR={targetFLR}
              onFLRChange={setTargetFLR}
              manualLotSize={manualLotSize}
              onLotSizeChange={setManualLotSize}
              residentialSF={residentialSF}
              onResidentialChange={setResidentialSF}
              officeSF={officeSF}
              onOfficeChange={setOfficeSF}
              retailSF={retailSF}
              onRetailChange={setRetailSF}
              commonAreasSF={commonAreasSF}
              onCommonAreasChange={setCommonAreasSF}
              parkingSpacesSF={parkingSpacesSF}
              onParkingSpacesChange={setParkingSpacesSF}
              parkingSFPerSpace={parkingSFPerSpace}
              onParkingSFPerSpaceChange={setParkingSFPerSpace}
              units={units}
              onUnitsChange={setUnits}
            />
          </section>
        </div>

        {/* Right Panel: Outputs */}
        <div className="right-panel">
          {/* Elevation Wireframe */}
          <section className="panel-section preview-section">
            <h2>Building Elevation</h2>
            {elevationData && (
              <ElevationPreview
                elevationData={elevationData}
                settings={settings}
              />
            )}
          </section>

          {/* Data Sheet */}
          <section className="panel-section data-section">
            <h2>Project Summary</h2>
            {massingOutput && (
              <DataSheet
                output={massingOutput}
                inputs={{
                  address,
                  lotSize: manualLotSize,
                  buildingType,
                  targetFAR,
                  targetFLR,
                }}
              />
            )}
          </section>
        </div>
      </div>

      {/* Settings Panel (Overlay) */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
