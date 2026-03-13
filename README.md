# Massing Study Generator

**Commercial Real Estate Development Concept Tool**

A fast, professional massing visualization tool for real estate brokers. Generate schematic building concepts with setbacks, unit counts, parking, and program mix—perfect for Offering Memoranda and web listings.

## Features

- **Site Mapping**: Draw lot boundaries on Google Maps
- **Zoning Rules**: 10 customizable zoning codes with setbacks, height, FAR limits
- **Building Parameters**: Control floors, FAR, FLR, unit counts, parking
- **Real-time Calculation**: Instant updates as you adjust sliders
- **Side Elevation Wireframe**: Clean schematic outline for AI rendering tools
- **Data Export**: CSV summary suitable for presentations
- **Customizable Settings**: Adjust zoning codes, unit defaults, and colors

## Setup (< 3 minutes)

### Prerequisites
- Node.js 16+
- npm or yarn

### Install & Run

```bash
# Clone or navigate to project
cd massing-study-generator

# Install dependencies
npm install

# Start dev server (opens in browser)
npm run dev

# Build for production
npm run build
```

Dev server runs at `http://localhost:5173`

## Configuration

### Google Maps API Key

Edit `index.html` and replace `YOUR_GOOGLE_MAPS_API_KEY`:

```html
<script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing,geometry"></script>
```

[Get a free API key](https://developers.google.com/maps/get-started)

### Zoning Codes

Update zoning rules via **Settings** panel in the app, or edit `/src/utils/settings.ts`:

```typescript
{
  id: "c2",
  name: "C-2 General Commercial",
  frontSetback: 10,
  sideSetback: 5,
  rearSetback: 5,
  maxHeight: 85,
  maxFAR: 3.0,
  maxLotCoverage: 80,
}
```

## Usage

### 1. **Site Setup**
- Use the Google Maps tool to draw your lot boundary (polygon or rectangle)
- Enter the address in the text field

### 2. **Building Parameters**
- Select zoning code (determines max height, FAR, setbacks)
- Set desired number of floors
- Adjust target FAR and FLR via sliders

### 3. **Program Mix**
- Slide to allocate SF for residential, office, retail, common areas
- Set parking spaces and SF-per-space requirement
- For residential: adjust unit counts and sizes by type

### 4. **View Results**
- **Elevation Wireframe**: Side profile showing setbacks and floor divisions
- **Project Summary**: Building SF, unit counts, parking, zoning compliance
- Export as SVG (for Canva, Midjourney, etc.) or CSV (for docs)

## Project Structure

```
src/
├── components/
│   ├── MapDrawer.tsx          # Google Maps + boundary drawing
│   ├── FormInputs.tsx         # All parameter sliders
│   ├── ElevationPreview.tsx   # Wireframe rendering & export
│   ├── DataSheet.tsx          # Project summary table
│   └── SettingsPanel.tsx      # Zoning, defaults, appearance config
├── hooks/
│   └── (custom React hooks - extensible)
├── types/
│   └── index.ts               # TypeScript interfaces
├── utils/
│   ├── massingCalculator.ts   # FAR/FLR → building dimensions
│   ├── wireframeRenderer.ts   # SVG elevation generation
│   └── settings.ts            # Default zoning codes & config
├── styles/
│   └── globals.css            # Utilitarian, broker-focused UI
├── App.tsx                     # Main orchestration
├── main.tsx                    # React entry point
└── index.html                  # HTML shell
```

## Architecture

### State Management
App-level state (no Redux needed). Props cascade down to components.

### Data Flow
1. User adjusts sliders → state updates
2. `useEffect` triggers recalculation via `massingCalculator.ts`
3. Outputs update in real-time → components re-render

### Wireframe Rendering
- `wireframeRenderer.ts` generates SVG string
- Rendered inline via `dangerouslySetInnerHTML`
- Export as PNG via canvas or SVG via download

### Zoning Configuration
- 10 dummy codes in `/src/utils/settings.ts` (replace with real data)
- Editable via Settings panel (persisted in app state)
- Full schema: name, height, FAR, setbacks, lot coverage

## Customization

### Colors & Appearance
Settings > Appearance tab. Adjust:
- Wireframe line color
- Background color
- Accent color
- Export resolution (1080p, 2K, 4K)

### Unit Defaults
Settings > Building Defaults. Modify:
- Studio, 1BR, 2BR, 3BR default SF
- Parking ratio (spaces per unit)
- Common area %

### Adding Features
- **New parameter**: Add to `types/MassingInputs`, `FormInputs.tsx`, `massingCalculator.ts`
- **New zoning rule**: Edit zoning objects in `settings.ts`
- **Custom calculations**: Extend `massingCalculator.ts`

## Export Workflow

### To Canva or AI Image Generator
1. Generate massing study in app
2. Click **Export SVG** (Elevation Preview)
3. Upload SVG to Canva or Midjourney
4. Render with prompts (e.g., "luxury retail + apartments, modern facade")

### To Presentations
- CSV export (Project Summary) → paste into Excel/Google Sheets
- PNG export (Elevation) → embed in PowerPoint or web listings
- SVG export → vectorize in Illustrator

## Troubleshooting

**Map not loading?**
- Check Google Maps API key in `index.html`
- Ensure key has Drawing Library enabled

**Drawing tool not responding?**
- Refresh page, try drawing polygon (not rectangle) first
- Check browser console for API errors

**Export not working?**
- Modern browsers only (Chrome, Safari, Firefox)
- Check developer tools Network tab for CORS issues

## Performance Notes

- Sliders update responsively; no debouncing needed (small calculations)
- SVG renders instantly for typical 10-floor buildings
- PNG export is async (avoids blocking UI)

## Future Enhancements

- 3D interactive visualization (Three.js)
- Parking layout diagram (on-site vs. podium)
- Floor-by-floor breakdown (unit mix per floor)
- Site context visualization (neighboring buildings)
- OM template integration
- Zoning compliance visual indicators

## License

Personal use. Modify and extend as needed.

---

**Built for brokers, by designers.**
