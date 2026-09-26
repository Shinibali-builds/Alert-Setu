import {
  AlertLanguage,
  AlertTranslation,
  OfficialEmergencyAlert,
  SAMPLE_ALERTS,
  TRANSLATIONS,
} from '../data/lastMileAlerts';

export type Audience =
  | 'General Public'
  | 'Low Literacy'
  | 'Older Adults'
  | 'People with Disabilities'
  | 'Visitors / New Residents';

export type DeliveryMode =
  | 'SMS'
  | 'Low-bandwidth Web'
  | 'Offline Relay'
  | 'Community Radio';

export type DeliveryStatus =
  | 'queued'
  | 'syncing'
  | 'sent'
  | 'delivered'
  | 'acknowledged'
  | 'failed';

export interface DeliveryReceipt {
  id: string;
  target: string;
  channel: DeliveryMode;
  status: DeliveryStatus;
  queuedAt: string;
  sentAt?: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
  bytes: number;
  errorMessage?: string;
  retryCount?: number;
}

export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  stale?: boolean;
  timestamp: number;
}

export function getTranslation(
  alert: OfficialEmergencyAlert,
  language: AlertLanguage
): AlertTranslation {
  const translation = TRANSLATIONS[alert.id]?.[language];

  if (translation) {
    return translation;
  }

  // Fallback to English translation or raw alert fields
  const englishFallback = TRANSLATIONS[alert.id]?.['English'];
  if (englishFallback) {
    return {
      ...englishFallback,
      language,
    };
  }

  return {
    language,
    headline: alert.headline,
    body: alert.body,
    action: alert.recommendedAction,
    area: alert.affectedArea,
  };
}

export function getPlainLanguage(
  alert: OfficialEmergencyAlert,
  audience: Audience
) {
  const isFlood = alert.hazard === 'Flood';
  const isCyclone = alert.hazard === 'Cyclone';
  const isHeatwave = alert.hazard === 'Heatwave';

  const plainVersions: Record<Audience, { headline: string; body: string; action: string }> = {
    'General Public': {
      headline:
        isFlood
          ? 'Heavy Rain and Flood Risk Alert'
          : isCyclone
          ? 'Cyclone Warning: High Winds and Rain'
          : isHeatwave
          ? 'Severe Heatwave Advisory'
          : `${alert.hazard.toUpperCase()} ADVISORY`,
      body:
        isFlood
          ? 'Heavy rainfall will cause rising waters in low-lying roads and riverside settlements. Stay alert and follow local safety advisories.'
          : isCyclone
          ? 'Severe cyclone bringing storm-force winds and heavy coastal rain. Avoid outdoor travel and prepare your shelter.'
          : isHeatwave
          ? 'Extreme temperatures forecast during daytime hours. Stay hydrated and avoid strenuous activities in direct sun.'
          : alert.body,
      action: alert.recommendedAction,
    },
    'Low Literacy': {
      headline:
        isFlood
          ? 'HEAVY RAIN • FLOOD DANGER'
          : isCyclone
          ? 'BIG STORM • DANGER WINDS'
          : isHeatwave
          ? 'EXTREME HEAT • DANGER'
          : `WARNING: ${alert.hazard.toUpperCase()}`,
      body:
        isFlood
          ? '1. WATER RISING FAST.\n2. DO NOT WALK IN FLOOD WATER.\n3. MOVE TO HIGH GROUND NOW.\n4. LISTEN TO LOCAL HELPERS.'
          : isCyclone
          ? '1. VERY STRONG WINDS COMING.\n2. STAY INSIDE A PUCCA HOUSE.\n3. STAY AWAY FROM SEA SHORE.\n4. KEEP LIGHT AND WATER READY.'
          : isHeatwave
          ? '1. SUN IS VERY HOT.\n2. DRINK WATER EVERY HOUR.\n3. DO NOT GO OUT IN MIDDAY.\n4. REST IN SHADE.'
          : 'DANGER OUTSIDE. MOVE TO A SAFE PLACE NOW.',
      action:
        isFlood
          ? 'DO NOT CROSS FLOODED ROADS. MOVE TO HIGH GROUND.'
          : isCyclone
          ? 'STAY INSIDE STURDY BUILDING. AVOID COAST.'
          : isHeatwave
          ? 'DRINK WATER AND STAY IN SHADE.'
          : 'FOLLOW LOCAL ADVISORY IMMEDIATELY.',
    },
    'Older Adults': {
      headline:
        isFlood
          ? 'Flood Advisory for Seniors: Stay in Sturdy Shelter'
          : isCyclone
          ? 'Cyclone Advisory for Seniors: Secure Safe Shelter'
          : 'Weather Safety Advisory for Seniors',
      body:
        'Please avoid venturing outdoors. Keep your daily prescription medications, walking aids, drinking water, and fully charged emergency flashlights in an easily reachable bag. Reach out to family or community ward volunteers early.',
      action: 'Remain indoors. Keep essential medicines and emergency contact numbers within arm reach.',
    },
    'People with Disabilities': {
      headline:
        isFlood
          ? 'Accessible Emergency Alert: Flood Evacuation Readiness'
          : isCyclone
          ? 'Accessible Emergency Alert: Cyclone Shelter Preparedness'
          : 'Accessible Safety Advisory',
      body:
        'Ensure power backup for assistive and mobility devices (electric wheelchairs, hearing aids, oxygen concentrators). Confirm evacuation routes are accessible or notify local emergency helpline if accessible transit is required.',
      action: 'Keep assistive devices and spare batteries ready. Contact disability support desk or dial 112 if assistance is needed.',
    },
    'Visitors / New Residents': {
      headline:
        isFlood
          ? 'Visitor Safety Alert: Local Flash Flood Hazards'
          : isCyclone
          ? 'Visitor Safety Alert: Coastal Cyclone Warning'
          : 'Visitor Emergency Advisory',
      body:
        'You are currently in an area unfamiliar to flash flooding or cyclone storm surges. Do not follow GPS navigation routes through submerged underpasses or coastal roads. Shelter in your hotel or registered shelter.',
      action: 'Do not attempt transit through unfamiliar waterlogged routes. Consult local ward desk or hotel front desk.',
    },
  };

  const selected = plainVersions[audience] || plainVersions['General Public'];

  return {
    headline: selected.headline,
    body: selected.body,
    action: selected.action,
    area: alert.affectedArea,
  };
}

export function encodeLowBandwidthPayload(
  alert: OfficialEmergencyAlert,
  translation: AlertTranslation,
  includeVisual = false
) {
  const payload = {
    id: alert.id,
    sev: alert.severity,
    hz: alert.hazard,
    area: translation.area,
    hl: translation.headline,
    act: translation.action,
    iss: alert.issuedAt,
    exp: alert.validUntil,
    ...(includeVisual
      ? {
          vis: ['stay-safe', 'avoid-water', 'follow-updates'],
        }
      : {}),
  };

  const text = JSON.stringify(payload, null, 2);
  const compactText = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(compactText).byteLength;

  return {
    payload,
    bytes,
    text,
    compactText,
  };
}

export function createRadioScript(
  alert: OfficialEmergencyAlert,
  translation: AlertTranslation,
  stationName = 'Community Radio Akash'
): string {
  return `[CHIME / SIREN 3 SECONDS]
"ATTENTION ALL RESIDENTS. THIS IS A PRIORITY PUBLIC SAFETY ADVISORY TRANSMITTED OVER ${stationName}.

HAZARD: ${alert.hazard.toUpperCase()} (${alert.severity} WARNING).
AFFECTED ZONE: ${translation.area}.

MESSAGE DETAILS:
${translation.headline}.
${translation.body}

MANDATORY PUBLIC ACTION:
${translation.action}

VALIDITY:
This warning remains in effect until ${alert.validUntil}.

Please share this message with elderly family members and neighbors without mobile phones. Stand by for further bulletins every 30 minutes. Stay calm, stay informed."
[OUTRO CHIME]`;
}

const STORAGE_KEY = 'alertsetu-receipts-v1';

export function loadReceipts(): DeliveryReceipt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Unable to load AlertSetu receipts from storage', err);
    return [];
  }
}

export function saveReceipts(receipts: DeliveryReceipt[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(receipts.slice(-100))
    );
  } catch (err) {
    console.warn('Unable to persist AlertSetu receipts to storage', err);
  }
}

export function createReceipts(
  alert: OfficialEmergencyAlert,
  mode: DeliveryMode,
  targets: string[],
  bytes: number
): DeliveryReceipt[] {
  const now = new Date().toISOString();

  return targets.map((target, index) => ({
    id: `${alert.id}-${mode.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}-${index}`,
    target,
    channel: mode,
    status: 'queued',
    queuedAt: now,
    bytes,
    retryCount: 0,
  }));
}

// Fetch helper with timeout and abort controller
export async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8000
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with HTTP status ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeout);
  }
}

// Alert Ingestion Abstraction
export interface AlertProvider {
  getActiveAlerts(): Promise<OfficialEmergencyAlert[]>;
  getAlertById(id: string): Promise<OfficialEmergencyAlert | null>;
  validateAlert(data: unknown): boolean;
}

export class DemoAlertProvider implements AlertProvider {
  async getActiveAlerts(): Promise<OfficialEmergencyAlert[]> {
    return Promise.resolve(SAMPLE_ALERTS);
  }

  async getAlertById(id: string): Promise<OfficialEmergencyAlert | null> {
    const found = SAMPLE_ALERTS.find((a) => a.id === id) || null;
    return Promise.resolve(found);
  }

  validateAlert(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false;
    const d = data as Record<string, unknown>;
    return typeof d.id === 'string' && typeof d.hazard === 'string' && typeof d.severity === 'string';
  }
}
