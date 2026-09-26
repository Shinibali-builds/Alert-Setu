# MAUSAM & ALERTSETU — Last-Mile Emergency Intelligence

> Comprehensive Indian atmospheric intelligence platform integrating real-time weather monitoring, Doppler radar, tropical cyclone tracking, NAQI air quality, and the **AlertSetu** Last-Mile Emergency Communication Pipeline.

---

## 1. Overview & Architecture

**MAUSAM** (inspired by [codesbysayam/mausam](https://github.com/codesbysayam/mausam) and [mausamgovt.vercel.app](https://mausamgovt.vercel.app/)) is an atmospheric intelligence suite designed for Indian meteorological subdivisions. 

**AlertSetu** is an emergency communication layer built directly into MAUSAM. It solves the critical "last-mile" disaster communication bottleneck by transforming complex meteorological Common Alerting Protocol (CAP) bulletins into:
1. **Plain-Language Guidance** modulated for 5 distinct literacy and accessibility cohorts.
2. **5 Indian Vernacular Translations** (English, Hindi, Odia, Bengali, Telugu).
3. **Visual Action Studio** featuring high-contrast glanceable icon cards for low-literacy populations.
4. **Resilient Multi-Channel Delivery** (GSM SMS, Ultra-Lean JSON Packet under 1KB, Offline Store-and-Forward Mesh, Community Radio Script).
5. **Deterministic Receipt State Machine & Telemetry** (QUEUED → SYNCING → SENT → DELIVERED → ACKNOWLEDGED).

```
                      OFFICIAL SOURCE INTAKE (CAP Protocol)
                                       │
                                       ▼
                     TARGET AUDIENCE PLAIN LANGUAGE ENGINE
         (General Public | Low Literacy | Seniors | Disabilities | Visitors)
                                       │
                                       ▼
                           REGIONAL LANGUAGE BANK
                  (English | हिन्दी | ଓଡ଼ିଆ | বাংলা | తెలుగు)
                                       │
                                       ▼
                       VISUAL STUDIO (Glanceable Icons)
                                       │
                                       ▼
                   MULTI-CHANNEL LAST-MILE DISPATCH ENGINE
                 (SMS | Low-BW JSON | Offline Mesh | FM Radio)
                                       │
                                       ▼
                      RECEIPT TRACKER & ACKNOWLEDGEMENT
               (QUEUED → SYNCING → SENT → DELIVERED → ACKNOWLEDGED)
```

---

## 2. Routes & Navigation

| Route | View | Description |
|---|---|---|
| `/` or `/weather` | **Weather Command Center** | Real-time weather for Indian cities, temperature, wind, humidity, UV index, soil moisture, marine tide status, and 24-hr micro-forecast. |
| `/forecast` | **Extended Forecast** | 7-day synoptic outlook with rain probability, temperature envelopes, wind gusts, and NWP model confidence. |
| `/warnings` | **IMD Warning Matrix** | Color-coded Yellow, Orange, and Red alerts across subdivisions with district-level impacts. |
| `/radar` | **Doppler Radar (DWR)** | Interactive Doppler Weather Radar simulation, dBZ reflectivity scale (0 to 65+ dBZ), sweep beam, station selector. |
| `/cyclone-tracker` | **Tropical Cyclone Tracker** | North Indian Ocean basin storm tracking, wind speed in knots/kmh, central pressure, landfall cones, and 4-stage warnings. |
| `/aqi` | **National Air Quality (NAQI)** | CAAQMS monitoring across Indian cities with PM2.5, PM10, NO2, SO2 sub-indices and health cautions. |
| `/agromet` | **Agromet Advisories (GKMS)** | Gramin Krishi Mausam Sewa crop weather advisories (Paddy, Vegetables, Sugarcane, Pulses), soil moisture, pest forecasts. |
| `/reports` | **Bulletins & Reports** | All India daily weather summary, rainfall departure tables, printable meteorological bulletins. |
| `/last-mile` (aliases: `/alertsetu`, `/emergency`) | **AlertSetu Emergency Engine** | The complete 14-section last-mile emergency communication system. |

---

## 3. Data Model

### Official Alert Data Structure (`src/data/lastMileAlerts.ts`)

```typescript
export type AlertSeverity = 'YELLOW' | 'ORANGE' | 'RED';

export type AlertLanguage =
  | 'English'
  | 'Hindi'
  | 'Odia'
  | 'Bengali'
  | 'Telugu';

export interface OfficialEmergencyAlert {
  id: string;
  hazard: 'Flood' | 'Cyclone' | 'Heatwave' | 'Thunderstorm';
  severity: AlertSeverity;
  headline: string;
  body: string;
  affectedArea: string;
  issuedAt: string;
  validUntil: string;
  recommendedAction: string;
  source: string;
  sourceReference: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  isSynthetic?: boolean;
}
```

---

## 4. Content Provenance & Safety Rules

To maintain strict boundaries between official emergency warnings and derived content:

1. **`OFFICIAL SOURCE CONTENT`**: Guaranteed read-only. Sourced from meteorological authorities. Immutable across the UI.
2. **`DERIVED CONTENT`**: Generated for comprehension; strictly preserves official severity, hazard, and affected area.
3. **`TRANSLATION`**: Vernacular translation for rapid local uptake; explicitly marked as humanitarian translation.
4. **`PLAIN-LANGUAGE VERSION`**: Audience-specific modulation for low literacy, older adults, and disability access.
5. **`VISUAL VERSION`**: Universal visual symbols for zero-literacy and emergency glanceability.
6. **`COMMUNITY-GENERATED • NOT OFFICIAL`**: Ground observations by volunteers; kept strictly isolated on a separate layer and cannot alter official alerts.
7. **`DEMO TELEMETRY`**: Indicates audit log entries and simulated delivery states.
8. **`SAMPLE / SYNTHETIC DATA`**: Clearly marked on all sample alerts.

---

## 5. Map Implementation & Tile Resilience

- **Engine**: Leaflet + React-Leaflet with OpenStreetMap tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **No API Keys Required**: Does not rely on Mapbox or Google Maps tokens; no intrusive key prompts appear when zooming or panning.
- **Vector Markers**: Employs SVG `CircleMarker` and `Circle` geometries to eliminate broken PNG asset issues in bundled production builds.
- **Graceful Fallback**: If tile network requests fail or are blocked, the map container displays coordinates, impact radius, and emergency data without interrupting the rest of the AlertSetu workflow.

---

## 6. Multi-Channel Dispatch & Telemetry State Machine

AlertSetu simulates four disaster-hardened delivery channels:
- **SMS Gateway**: GSM 03.38 compliant 142-character emergency SMS segment.
- **Low-Bandwidth Web**: TextEncoder-measured compact JSON telegram (< 1KB) suitable for congested 2G and LoRa networks.
- **Offline Relay**: Store-and-forward buffer simulating edge relay nodes (Ward Desks, Cyclone Shelters, Volunteer Desks).
- **Community Radio**: Formatted text-to-speech / announcer emergency script with chime markers and broadcast instructions.

### Delivery Lifecycle
```
QUEUED  ──(350ms)──▶  SYNCING  ──(400ms)──▶  SENT  ──(650ms)──▶  DELIVERED  ──(Manual)──▶  ACKNOWLEDGED
                                                                       │
                                                                   (On Error)
                                                                       ▼
                                                                     FAILED  ──(Retry)──▶  QUEUED
```

All receipt records are persisted in local storage (`alertsetu-receipts-v1`) up to the 100 most recent records.

---

## 7. Accessibility & Inclusivity Standards

- **Semantic HTML**: Buttons, landmarks, and headings with proper hierarchy.
- **WCAG Contrast**: High-contrast text on dark backgrounds (`#030712`).
- **Screen Reader Support**: `aria-live="polite"` on dynamic delivery telemetry and receipt status updates.
- **Multi-Modal Severity**: Severity is never communicated by color alone; every badge includes text labels (`RED`, `ORANGE`, `YELLOW`) and warning icons.
- **Low-Literacy Mode**: Action-first numbered steps, uppercase bold cues, and high visual emphasis.

---

## 8. Development & Build

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Dev server starts at `http://localhost:3000`.

### Typecheck & Lint
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

---

## 9. Limitations & Disclaimer

- **Demonstration Data**: All alert bulletins in this demonstration are **synthetic demonstration alerts** modeled after official IMD CAP schemas.
- **Simulated Delivery**: SMS, radio, and mesh transmissions are simulated within browser memory and local storage. No real SMS or radio broadcasts are transmitted unless production telecom gateways are explicitly bound to the backend.
- **Telemetry Notice**: Acknowledgement timestamps demonstrate the state-machine pipeline for disaster response teams.
