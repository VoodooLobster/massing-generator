import React from "react";
import { ZoningCode, BuildingType, UnitConfig } from "../types/index";

interface FormInputsProps {
  zoningCodes: ZoningCode[];
  zoningCodeId: string;
  onZoningChange: (id: string) => void;
  buildingType: BuildingType;
  onBuildingTypeChange: (type: BuildingType) => void;
  numFloors: number;
  onNumFloorsChange: (value: number) => void;
  targetFAR: number;
  onFARChange: (value: number) => void;
  targetFLR: number;
  onFLRChange: (value: number) => void;
  manualLotSize: number;
  onLotSizeChange: (value: number) => void;
  residentialSF: number;
  onResidentialChange: (value: number) => void;
  officeSF: number;
  onOfficeChange: (value: number) => void;
  retailSF: number;
  onRetailChange: (value: number) => void;
  commonAreasSF: number;
  onCommonAreasChange: (value: number) => void;
  parkingSpacesSF: number;
  onParkingSpacesChange: (value: number) => void;
  parkingSFPerSpace: number;
  onParkingSFPerSpaceChange: (value: number) => void;
  units: UnitConfig[];
  onUnitsChange: (units: UnitConfig[]) => void;
}

export const FormInputs: React.FC<FormInputsProps> = ({
  zoningCodes,
  zoningCodeId,
  onZoningChange,
  buildingType,
  onBuildingTypeChange,
  numFloors,
  onNumFloorsChange,
  targetFAR,
  onFARChange,
  targetFLR,
  onFLRChange,
  manualLotSize,
  onLotSizeChange,
  residentialSF,
  onResidentialChange,
  officeSF,
  onOfficeChange,
  retailSF,
  onRetailChange,
  commonAreasSF,
  onCommonAreasChange,
  parkingSpacesSF,
  onParkingSpacesChange,
  parkingSFPerSpace,
  onParkingSFPerSpaceChange,
  units,
  onUnitsChange,
}) => {
  const formatNumber = (num: number) => new Intl.NumberFormat("en-US").format(Math.round(num));

  const updateUnit = (type: string, field: string, value: number) => {
    const updated = units.map((u) =>
      u.type === type ? { ...u, [field]: value } : u
    );
    onUnitsChange(updated);
  };

  return (
    <form className="form-inputs">
      {/* Site & Zoning */}
      <fieldset className="form-fieldset">
        <legend>Site & Zoning</legend>

        <label className="form-label">
          Zoning Code
          <select
            value={zoningCodeId}
            onChange={(e) => onZoningChange(e.target.value)}
            className="form-select"
          >
            {zoningCodes.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Lot Size (SF): {formatNumber(manualLotSize)}
          <input
            type="range"
            min="10000"
            max="500000"
            step="5000"
            value={manualLotSize}
            onChange={(e) => onLotSizeChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>

        <label className="form-label">
          Target FAR: {targetFAR.toFixed(2)}
          <input
            type="range"
            min="0.5"
            max="8"
            step="0.1"
            value={targetFAR}
            onChange={(e) => onFARChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>

        <label className="form-label">
          Target FLR: {targetFLR.toFixed(2)}
          <input
            type="range"
            min="0.5"
            max="8"
            step="0.1"
            value={targetFLR}
            onChange={(e) => onFLRChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>
      </fieldset>

      {/* Building Type & Configuration */}
      <fieldset className="form-fieldset">
        <legend>Building Configuration</legend>

        <label className="form-label">
          Primary Use Type
          <select
            value={buildingType}
            onChange={(e) => onBuildingTypeChange(e.target.value as BuildingType)}
            className="form-select"
          >
            <option value="residential">Residential</option>
            <option value="office">Office</option>
            <option value="retail">Retail</option>
            <option value="mixed-use">Mixed-Use</option>
          </select>
        </label>

        <label className="form-label">
          Number of Floors: {numFloors}
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={numFloors}
            onChange={(e) => onNumFloorsChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>
      </fieldset>

      {/* Program Mix */}
      <fieldset className="form-fieldset">
        <legend>Program Mix (SF)</legend>

        <label className="form-label">
          Residential: {formatNumber(residentialSF)}
          <input
            type="range"
            min="0"
            max="500000"
            step="5000"
            value={residentialSF}
            onChange={(e) => onResidentialChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>

        <label className="form-label">
          Office: {formatNumber(officeSF)}
          <input
            type="range"
            min="0"
            max="500000"
            step="5000"
            value={officeSF}
            onChange={(e) => onOfficeChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>

        <label className="form-label">
          Retail: {formatNumber(retailSF)}
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={retailSF}
            onChange={(e) => onRetailChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>

        <label className="form-label">
          Common Areas: {formatNumber(commonAreasSF)}
          <input
            type="range"
            min="0"
            max="100000"
            step="2000"
            value={commonAreasSF}
            onChange={(e) => onCommonAreasChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>
      </fieldset>

      {/* Parking */}
      <fieldset className="form-fieldset">
        <legend>Parking</legend>

        <label className="form-label">
          Total Parking SF: {formatNumber(parkingSpacesSF)}
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={parkingSpacesSF}
            onChange={(e) => onParkingSpacesChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>

        <label className="form-label">
          SF per Parking Space: {parkingSFPerSpace}
          <input
            type="range"
            min="300"
            max="500"
            step="10"
            value={parkingSFPerSpace}
            onChange={(e) => onParkingSFPerSpaceChange(Number(e.target.value))}
            className="form-slider"
          />
        </label>
      </fieldset>

      {/* Unit Mix (Residential) */}
      {buildingType === "residential" || buildingType === "mixed-use" ? (
        <fieldset className="form-fieldset">
          <legend>Unit Mix</legend>
          {units.map((unit) => (
            <div key={unit.type} className="unit-row">
              <label className="form-label">
                {unit.type.toUpperCase()} Count: {unit.count}
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="1"
                  value={unit.count}
                  onChange={(e) => updateUnit(unit.type, "count", Number(e.target.value))}
                  className="form-slider"
                />
              </label>
              <label className="form-label">
                SF: {unit.defaultSF}
                <input
                  type="range"
                  min="300"
                  max="2500"
                  step="50"
                  value={unit.defaultSF}
                  onChange={(e) => updateUnit(unit.type, "defaultSF", Number(e.target.value))}
                  className="form-slider form-slider-secondary"
                />
              </label>
            </div>
          ))}
        </fieldset>
      ) : null}
    </form>
  );
};
