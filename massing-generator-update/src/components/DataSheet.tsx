import React from "react";
import { MassingOutput } from "../types/index";

interface DataSheetProps {
  output: MassingOutput;
  inputs: {
    address: string;
    lotSize: number;
    buildingType: string;
    targetFAR: number;
    targetFLR: number;
    totalBuildingSF?: number;
    totalFloors?: number;
    street?: { frontage: number };
  };
  onGenerateIsometric?: () => void;
}

export const DataSheet: React.FC<DataSheetProps> = ({ output, inputs, onGenerateIsometric }) => {
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("en-US").format(Math.round(num));
  const formatSF = (num: number) => new Intl.NumberFormat("en-US").format(Math.round(num));

  return (
    <div className="data-sheet">
      {/* Summary Table */}
      <table className="summary-table">
        <tbody>
          <tr>
            <td className="label">Project Address</td>
            <td className="value">{inputs.address}</td>
          </tr>
          <tr>
            <td className="label">Lot Size</td>
            <td className="value">{formatSF(inputs.lotSize)} SF</td>
          </tr>
          <tr>
            <td className="label">Building Type</td>
            <td className="value">{inputs.buildingType}</td>
          </tr>
          <tr>
            <td className="label">Total Building SF</td>
            <td className="value highlight">{formatSF(output.totalBuildingSF)} SF</td>
          </tr>
          <tr>
            <td className="label">Total Floors</td>
            <td className="value">{output.totalFloors}</td>
          </tr>
          <tr>
            <td className="label">Floor-Avg SF</td>
            <td className="value">{formatSF(output.floorAverageSF)} SF</td>
          </tr>
        </tbody>
      </table>

      {/* FAR & FLR */}
      <table className="summary-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Target</th>
            <th>Achieved</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>FAR</td>
            <td>{inputs.targetFAR.toFixed(2)}</td>
            <td className={output.farAchieved > inputs.targetFAR ? "over" : ""}>
              {output.farAchieved.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td>FLR</td>
            <td>{inputs.targetFLR.toFixed(2)}</td>
            <td className={output.flrAchieved > inputs.targetFLR ? "over" : ""}>
              {output.flrAchieved.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Unit & Parking */}
      <table className="summary-table">
        <tbody>
          {output.residentialUnits > 0 && (
            <>
              <tr className="group-header">
                <td colSpan={2}>Residential Units</td>
              </tr>
              <tr>
                <td className="label">Studios</td>
                <td className="value">{output.unitCounts.studio || 0}</td>
              </tr>
              <tr>
                <td className="label">1-Bedroom</td>
                <td className="value">{output.unitCounts["1br"] || 0}</td>
              </tr>
              <tr>
                <td className="label">2-Bedroom</td>
                <td className="value">{output.unitCounts["2br"] || 0}</td>
              </tr>
              <tr>
                <td className="label">3-Bedroom</td>
                <td className="value">{output.unitCounts["3br"] || 0}</td>
              </tr>
              <tr>
                <td className="label">Total Units</td>
                <td className="value highlight">{output.residentialUnits}</td>
              </tr>
              <tr>
                <td className="label">Avg Unit SF</td>
                <td className="value">{formatSF(output.unitAverageSF)} SF</td>
              </tr>
            </>
          )}
          <tr className="group-header">
            <td colSpan={2}>Parking</td>
          </tr>
          <tr>
            <td className="label">Parking Spaces</td>
            <td className="value highlight">{output.parkingSpaces}</td>
          </tr>
        </tbody>
      </table>

      {/* Compliance Notes */}
      <div className="compliance-notes">
        <h4>Zoning Compliance</h4>
        <ul>
          {output.complianceNotes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>

      {/* Export Buttons */}
      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={() => {
            const csv = generateCSV(output, inputs);
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "massing-data.csv";
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          ↓ Export Data (CSV)
        </button>

        <button
          className="btn btn-primary"
          onClick={onGenerateIsometric}
        >
          🏢 Generate 3D View
        </button>
      </div>
    </div>
  );
};

function generateCSV(output: MassingOutput, inputs: any): string {
  const rows = [
    ["Commercial Massing Study", ""],
    ["", ""],
    ["Project Address", inputs.address],
    ["Lot Size (SF)", inputs.lotSize],
    ["Building Type", inputs.buildingType],
    ["", ""],
    ["Total Building SF", output.totalBuildingSF],
    ["Total Floors", output.totalFloors],
    ["Floor-Avg SF", output.floorAverageSF],
    ["", ""],
    ["FAR Target", inputs.targetFAR],
    ["FAR Achieved", output.farAchieved.toFixed(2)],
    ["FLR Target", inputs.targetFLR],
    ["FLR Achieved", output.flrAchieved.toFixed(2)],
    ["", ""],
    ["Residential Units", output.residentialUnits],
    ["Studios", output.unitCounts.studio || 0],
    ["1-Bedroom", output.unitCounts["1br"] || 0],
    ["2-Bedroom", output.unitCounts["2br"] || 0],
    ["3-Bedroom", output.unitCounts["3br"] || 0],
    ["Avg Unit SF", output.unitAverageSF],
    ["", ""],
    ["Parking Spaces", output.parkingSpaces],
  ];

  return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
}
