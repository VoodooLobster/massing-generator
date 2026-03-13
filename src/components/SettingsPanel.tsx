import React, { useState } from "react";
import { AppSettings, ZoningCode } from "../types/index";

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "zoning" | "defaults" | "appearance"
  >("zoning");
  const [editingZoningId, setEditingZoningId] = useState<string | null>(null);

  const updateZoning = (id: string, field: string, value: any) => {
    const updated = settings.zoningCodes.map((z) =>
      z.id === id ? { ...z, [field]: value } : z
    );
    onSettingsChange({ ...settings, zoningCodes: updated });
  };

  const updateDefaults = (field: string, value: any) => {
    onSettingsChange({
      ...settings,
      buildingDefaults: { ...settings.buildingDefaults, [field]: value },
    });
  };

  const updateAppearance = (field: string, value: any) => {
    onSettingsChange({
      ...settings,
      appearance: { ...settings.appearance, [field]: value },
    });
  };

  return (
    <div className="settings-panel-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab ${activeTab === "zoning" ? "active" : ""}`}
            onClick={() => setActiveTab("zoning")}
          >
            Zoning Codes
          </button>
          <button
            className={`tab ${activeTab === "defaults" ? "active" : ""}`}
            onClick={() => setActiveTab("defaults")}
          >
            Building Defaults
          </button>
          <button
            className={`tab ${activeTab === "appearance" ? "active" : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            Appearance
          </button>
        </div>

        <div className="settings-content">
          {/* Zoning Codes Tab */}
          {activeTab === "zoning" && (
            <div className="tab-content">
              <h3>Zoning Codes (10 Presets)</h3>
              <div className="zoning-list">
                {settings.zoningCodes.map((zone) => (
                  <div key={zone.id} className="zoning-item">
                    <button
                      className={`zoning-name ${editingZoningId === zone.id ? "editing" : ""}`}
                      onClick={() =>
                        setEditingZoningId(
                          editingZoningId === zone.id ? null : zone.id
                        )
                      }
                    >
                      {zone.name}
                    </button>

                    {editingZoningId === zone.id && (
                      <div className="zoning-edit">
                        <label>
                          Max Height (ft):
                          <input
                            type="number"
                            value={zone.maxHeight}
                            onChange={(e) =>
                              updateZoning(zone.id, "maxHeight", Number(e.target.value))
                            }
                          />
                        </label>
                        <label>
                          Max FAR:
                          <input
                            type="number"
                            step="0.1"
                            value={zone.maxFAR}
                            onChange={(e) =>
                              updateZoning(zone.id, "maxFAR", Number(e.target.value))
                            }
                          />
                        </label>
                        <label>
                          Front Setback (ft):
                          <input
                            type="number"
                            value={zone.frontSetback}
                            onChange={(e) =>
                              updateZoning(zone.id, "frontSetback", Number(e.target.value))
                            }
                          />
                        </label>
                        <label>
                          Side Setback (ft):
                          <input
                            type="number"
                            value={zone.sideSetback}
                            onChange={(e) =>
                              updateZoning(zone.id, "sideSetback", Number(e.target.value))
                            }
                          />
                        </label>
                        <label>
                          Rear Setback (ft):
                          <input
                            type="number"
                            value={zone.rearSetback}
                            onChange={(e) =>
                              updateZoning(zone.id, "rearSetback", Number(e.target.value))
                            }
                          />
                        </label>
                        <label>
                          Max Lot Coverage (%):
                          <input
                            type="number"
                            value={zone.maxLotCoverage}
                            onChange={(e) =>
                              updateZoning(
                                zone.id,
                                "maxLotCoverage",
                                Number(e.target.value)
                              )
                            }
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Building Defaults Tab */}
          {activeTab === "defaults" && (
            <div className="tab-content">
              <h3>Unit Size Defaults</h3>
              <label>
                Studio (SF):
                <input
                  type="number"
                  value={settings.buildingDefaults.studioDefaultSF}
                  onChange={(e) => updateDefaults("studioDefaultSF", Number(e.target.value))}
                />
              </label>
              <label>
                1-Bedroom (SF):
                <input
                  type="number"
                  value={settings.buildingDefaults.oneBRDefaultSF}
                  onChange={(e) => updateDefaults("oneBRDefaultSF", Number(e.target.value))}
                />
              </label>
              <label>
                2-Bedroom (SF):
                <input
                  type="number"
                  value={settings.buildingDefaults.twoBRDefaultSF}
                  onChange={(e) => updateDefaults("twoBRDefaultSF", Number(e.target.value))}
                />
              </label>
              <label>
                3-Bedroom (SF):
                <input
                  type="number"
                  value={settings.buildingDefaults.threeBRDefaultSF}
                  onChange={(e) => updateDefaults("threeBRDefaultSF", Number(e.target.value))}
                />
              </label>

              <h3>Ratios & Percentages</h3>
              <label>
                Parking Ratio (spaces/unit):
                <input
                  type="number"
                  step="0.1"
                  value={settings.buildingDefaults.parkingRatio}
                  onChange={(e) => updateDefaults("parkingRatio", Number(e.target.value))}
                />
              </label>
              <label>
                Common Area (%):
                <input
                  type="number"
                  value={settings.buildingDefaults.commonAreaPercentage}
                  onChange={(e) =>
                    updateDefaults("commonAreaPercentage", Number(e.target.value))
                  }
                />
              </label>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="tab-content">
              <h3>Colors & Export</h3>
              <label>
                Wireframe Color:
                <div className="color-picker">
                  <input
                    type="color"
                    value={settings.appearance.wireframeColor}
                    onChange={(e) => updateAppearance("wireframeColor", e.target.value)}
                  />
                  <span>{settings.appearance.wireframeColor}</span>
                </div>
              </label>
              <label>
                Background Color:
                <div className="color-picker">
                  <input
                    type="color"
                    value={settings.appearance.backgroundColor}
                    onChange={(e) => updateAppearance("backgroundColor", e.target.value)}
                  />
                  <span>{settings.appearance.backgroundColor}</span>
                </div>
              </label>
              <label>
                Accent Color:
                <div className="color-picker">
                  <input
                    type="color"
                    value={settings.appearance.accentColor}
                    onChange={(e) => updateAppearance("accentColor", e.target.value)}
                  />
                  <span>{settings.appearance.accentColor}</span>
                </div>
              </label>

              <label>
                Export Resolution:
                <select
                  value={settings.appearance.exportResolution}
                  onChange={(e) =>
                    updateAppearance("exportResolution", e.target.value)
                  }
                >
                  <option value="1080p">1080p</option>
                  <option value="2k">2K</option>
                  <option value="4k">4K</option>
                </select>
              </label>
            </div>
          )}
        </div>

        <div className="settings-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
