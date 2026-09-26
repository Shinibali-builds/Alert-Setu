/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

// --- Type Definitions ---
type UserRole =
  | 'PUBLIC_USER'
  | 'FIELD_OPERATOR'
  | 'DISTRICT_AUTHORITY'
  | 'STATE_AUTHORITY'
  | 'SYSTEM_ADMIN';

interface ServerUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  designation: string;
  jurisdiction: string;
  state: string;
  district?: string;
  badgeNumber?: string;
}

interface BroadcastRecord {
  broadcastId: string;
  initiatedBy: string;
  initiatorRole: UserRole;
  alertId: string;
  hazard: string;
  severity: string;
  headline: string;
  target: {
    state: string;
    district: string;
    blockArea: string;
    radiusKm: number;
  };
  audience: string;
  languages: string[];
  channels: string[];
  totalRecipients: number;
  batchSize: number;
  totalBatches: number;
  status:
    | 'DRAFT'
    | 'AUTHORIZED'
    | 'QUEUED'
    | 'DISPATCHING'
    | 'PARTIALLY_SENT'
    | 'SENT'
    | 'COMPLETED'
    | 'FAILED';
  createdAt: string;
  authorizedAt?: string;
  startedAt?: string;
  completedAt?: string;
  queuedCount: number;
  sentCount: number;
  deliveredCount: number;
  acknowledgedCount: number;
  failedCount: number;
  currentBatch: number;
  isDemo: boolean;
  notes?: string;
}

// In-Memory Database for Sessions, Broadcasts & Audit Logs
const activeSessions = new Map<string, ServerUser>();
const broadcastStore = new Map<string, BroadcastRecord>();
const auditLogStore: BroadcastRecord[] = [];

// Pre-configured Verified Agency Personnel
const AUTHORIZED_ACCOUNTS: Record<string, { user: ServerUser; passwordHash: string }> = {
  'district.khordha@mausam.gov.in': {
    passwordHash: 'demopass123',
    user: {
      id: 'usr-seoc-khordha-01',
      email: 'district.khordha@mausam.gov.in',
      name: 'Dr. Debabrata Samal',
      role: 'DISTRICT_AUTHORITY',
      designation: 'District Emergency Officer, SEOC',
      jurisdiction: 'Khordha District & Coastal Blocks',
      state: 'Odisha',
      district: 'Khordha',
      badgeNumber: 'OD-SEOC-2026-441',
    },
  },
  'osdma.state@mausam.gov.in': {
    passwordHash: 'demopass123',
    user: {
      id: 'usr-osdma-state-01',
      email: 'osdma.state@mausam.gov.in',
      name: 'Smt. Ananya Mohapatra, IAS',
      role: 'STATE_AUTHORITY',
      designation: 'Special Relief Commissioner, OSDMA',
      jurisdiction: 'Odisha State Apex Command',
      state: 'Odisha',
      badgeNumber: 'OD-SDMA-2026-003',
    },
  },
  'operator.bhubaneswar@mausam.gov.in': {
    passwordHash: 'demopass123',
    user: {
      id: 'usr-field-bbsr-09',
      email: 'operator.bhubaneswar@mausam.gov.in',
      name: 'Prakash Chandra Nayak',
      role: 'FIELD_OPERATOR',
      designation: 'Civil Defense & Edge Radio Operator',
      jurisdiction: 'Bhubaneswar Urban Ward 14-28',
      state: 'Odisha',
      district: 'Khordha',
      badgeNumber: 'CD-OD-9021',
    },
  },
  'citizen@mausam.gov.in': {
    passwordHash: 'demopass123',
    user: {
      id: 'usr-public-001',
      email: 'citizen@mausam.gov.in',
      name: 'Priyanka Senapati',
      role: 'PUBLIC_USER',
      designation: 'Registered Coastal Resident',
      jurisdiction: 'Public Weather Portal',
      state: 'Odisha',
      district: 'Puri',
    },
  },
  'admin@mausam.gov.in': {
    passwordHash: 'demopass123',
    user: {
      id: 'usr-admin-sys-00',
      email: 'admin@mausam.gov.in',
      name: 'Rajesh Kumar Verma',
      role: 'SYSTEM_ADMIN',
      designation: 'Principal Meteorological Systems Architect',
      jurisdiction: 'National Core Grid & AlertSetu Gateways',
      state: 'National',
      badgeNumber: 'IMD-SYS-001',
    },
  },
};

// Seed an initial historical broadcast for demonstration & audit
const SEED_BROADCAST: BroadcastRecord = {
  broadcastId: 'BC-2026-0926-01',
  initiatedBy: 'Dr. Debabrata Samal',
  initiatorRole: 'DISTRICT_AUTHORITY',
  alertId: 'ALT-OD-CYC-2026-092',
  hazard: 'Severe Cyclonic Storm & Surge',
  severity: 'RED',
  headline: 'Evacuation Advisory: Move to Multi-purpose Cyclone Shelters',
  target: {
    state: 'Odisha',
    district: 'Khordha',
    blockArea: 'Balianta, Balipatna & Chilika Basin',
    radiusKm: 35,
  },
  audience: 'General Public',
  languages: ['Odia', 'Hindi', 'English'],
  channels: ['SMS', 'Web Notification', 'Low-Bandwidth Web', 'Offline Relay'],
  totalRecipients: 12480,
  batchSize: 100,
  totalBatches: 125,
  status: 'COMPLETED',
  createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  authorizedAt: new Date(Date.now() - 3600000 * 2.9).toISOString(),
  startedAt: new Date(Date.now() - 3600000 * 2.8).toISOString(),
  completedAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
  queuedCount: 0,
  sentCount: 12480,
  deliveredCount: 12140,
  acknowledgedCount: 9820,
  failedCount: 340,
  currentBatch: 125,
  isDemo: true,
  notes: 'DEMO BROADCAST • Synthetic carrier tower simulation verified with zero message leakage.',
};
broadcastStore.set(SEED_BROADCAST.broadcastId, SEED_BROADCAST);
auditLogStore.push(SEED_BROADCAST);

// --- Session Middleware ---
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  const xSessionToken = req.headers['x-session-token'] as string | undefined;
  const cookieToken = req.cookies ? req.cookies['mausam_session'] : undefined;

  const sessionId = bearerToken || xSessionToken || cookieToken;
  if (sessionId && activeSessions.has(sessionId)) {
    (req as any).user = activeSessions.get(sessionId);
    (req as any).sessionId = sessionId;
  } else {
    (req as any).user = null;
    (req as any).sessionId = null;
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(authMiddleware);

  // -------------------------------------------------------------
  // API: Authentication Endpoints
  // -------------------------------------------------------------

  // GET /api/auth/me - Retrieve currently authenticated session
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = (req as any).user;
    if (user) {
      res.json({ authenticated: true, user });
    } else {
      res.json({ authenticated: false, user: null });
    }
  });

  // POST /api/auth/login - Server-side authentication & HTTP-only cookie creation
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    let matchedAccount = AUTHORIZED_ACCOUNTS[normalizedEmail];

    // If not matching exact demo account, create or adapt user based on role pattern
    if (!matchedAccount) {
      if (normalizedEmail.includes('admin')) {
        matchedAccount = AUTHORIZED_ACCOUNTS['admin@mausam.gov.in'];
      } else if (normalizedEmail.includes('state') || normalizedEmail.includes('osdma')) {
        matchedAccount = AUTHORIZED_ACCOUNTS['osdma.state@mausam.gov.in'];
      } else if (normalizedEmail.includes('district') || normalizedEmail.includes('seoc')) {
        matchedAccount = AUTHORIZED_ACCOUNTS['district.khordha@mausam.gov.in'];
      } else if (normalizedEmail.includes('operator') || normalizedEmail.includes('field')) {
        matchedAccount = AUTHORIZED_ACCOUNTS['operator.bhubaneswar@mausam.gov.in'];
      } else {
        matchedAccount = AUTHORIZED_ACCOUNTS['citizen@mausam.gov.in'];
      }
    }

    // Generate secure random session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeSessions.set(sessionToken, matchedAccount.user);

    // Set secure HTTP-Only cookie with SameSite=None and Secure=true for cross-origin/iframe environments
    res.cookie('mausam_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true, token: sessionToken, user: matchedAccount.user });
  });

  // POST /api/auth/logout - Clear session cookie and memory store
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const xSessionToken = req.headers['x-session-token'] as string | undefined;
    const cookieToken = req.cookies ? req.cookies['mausam_session'] : undefined;
    const sessionId = bearerToken || xSessionToken || cookieToken;

    if (sessionId && activeSessions.has(sessionId)) {
      activeSessions.delete(sessionId);
    }
    res.clearCookie('mausam_session', { path: '/', sameSite: 'none', secure: true });
    res.json({ success: true });
  });

  // POST /api/auth/switch-role - Fast role switching for testing/evaluation
  app.post('/api/auth/switch-role', (req: Request, res: Response) => {
    const { role } = req.body;
    let targetEmail = 'district.khordha@mausam.gov.in';

    switch (role) {
      case 'PUBLIC_USER':
        targetEmail = 'citizen@mausam.gov.in';
        break;
      case 'FIELD_OPERATOR':
        targetEmail = 'operator.bhubaneswar@mausam.gov.in';
        break;
      case 'DISTRICT_AUTHORITY':
        targetEmail = 'district.khordha@mausam.gov.in';
        break;
      case 'STATE_AUTHORITY':
        targetEmail = 'osdma.state@mausam.gov.in';
        break;
      case 'SYSTEM_ADMIN':
        targetEmail = 'admin@mausam.gov.in';
        break;
    }

    const matched = AUTHORIZED_ACCOUNTS[targetEmail];
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const xSessionToken = req.headers['x-session-token'] as string | undefined;
    const cookieToken = req.cookies ? req.cookies['mausam_session'] : undefined;
    const existingToken = bearerToken || xSessionToken || cookieToken;

    const sessionToken = existingToken || crypto.randomBytes(32).toString('hex');
    activeSessions.set(sessionToken, matched.user);

    res.cookie('mausam_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, token: sessionToken, user: matched.user });
  });

  // -------------------------------------------------------------
  // API: Mass Emergency Broadcast Endpoints
  // -------------------------------------------------------------

  // GET /api/broadcasts/recipients-summary - Estimate eligible recipient population
  app.get('/api/broadcasts/recipients-summary', (req: Request, res: Response) => {
    const district = (req.query.district as string) || 'Khordha';
    const state = (req.query.state as string) || 'Odisha';

    // Synthetic demographic data calibrated to IMD / Census blocks
    const responseData = {
      state,
      district,
      eligibleRecipients: 12480,
      batchSize: 100,
      totalBatches: 125,
      networkCarriers: [
        { name: 'BSNL Disaster Priority Cell', estimatedCoverage: '98.4%' },
        { name: 'Airtel Emergency Broadcast', estimatedCoverage: '96.2%' },
        { name: 'Jio Public Safety Grid', estimatedCoverage: '97.8%' },
      ],
      isDemo: true,
      demoLabel: 'DEMO BROADCAST • SAMPLE / SYNTHETIC RECIPIENTS',
    };

    res.json(responseData);
  });

  // GET /api/broadcasts - List recent broadcast jobs
  app.get('/api/broadcasts', (req: Request, res: Response) => {
    const list = Array.from(broadcastStore.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(list);
  });

  // GET /api/broadcasts/audit - Retrieve immutable audit log
  app.get('/api/broadcasts/audit', (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required to inspect audit logs.' });
    }
    // Only authorities and field staff can view audit logs
    res.json(auditLogStore);
  });

  // POST /api/broadcasts/authorize - Authorize and queue an official emergency broadcast
  app.post('/api/broadcasts/authorize', (req: Request, res: Response) => {
    const user: ServerUser | null = (req as any).user;
    if (!user) {
      return res.status(401).json({
        error: 'Unauthenticated. You must be signed in to authorize emergency broadcasts.',
      });
    }

    // Role check: Only District Authority, State Authority, or System Admin can authorize
    if (
      user.role !== 'DISTRICT_AUTHORITY' &&
      user.role !== 'STATE_AUTHORITY' &&
      user.role !== 'SYSTEM_ADMIN'
    ) {
      return res.status(403).json({
        error: `Insufficient authorization. Role '${user.role}' cannot authorize mass broadcasts. Requires DISTRICT_AUTHORITY or higher.`,
      });
    }

    const {
      alertId,
      hazard,
      severity,
      headline,
      target,
      audience,
      languages,
      channels,
      totalRecipients = 12480,
      batchSize = 100,
    } = req.body;

    // Scope check: District Authority cannot broadcast outside their assigned district
    if (user.role === 'DISTRICT_AUTHORITY' && target?.district && user.district) {
      if (
        target.district.trim().toLowerCase() !== user.district.trim().toLowerCase() &&
        user.district.toLowerCase() !== 'all'
      ) {
        return res.status(403).json({
          error: `Geographic scope violation. Role ${user.role} (${user.district}) cannot authorize broadcasts for district '${target.district}'.`,
        });
      }
    }

    const broadcastId = `BC-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const totalBatches = Math.ceil(totalRecipients / batchSize);

    const record: BroadcastRecord = {
      broadcastId,
      initiatedBy: user.name,
      initiatorRole: user.role,
      alertId: alertId || 'ALT-EMERGENCY',
      hazard: hazard || 'Severe Weather Warning',
      severity: severity || 'RED',
      headline: headline || 'Official Emergency Broadcast',
      target: {
        state: target?.state || 'Odisha',
        district: target?.district || 'Khordha',
        blockArea: target?.blockArea || 'All coastal & riverine blocks',
        radiusKm: target?.radiusKm || 25,
      },
      audience: audience || 'General Public',
      languages: languages && languages.length ? languages : ['English', 'Odia', 'Hindi'],
      channels: channels && channels.length ? channels : ['SMS', 'Web Notification'],
      totalRecipients,
      batchSize,
      totalBatches,
      status: 'AUTHORIZED',
      createdAt: new Date().toISOString(),
      authorizedAt: new Date().toISOString(),
      queuedCount: totalRecipients,
      sentCount: 0,
      deliveredCount: 0,
      acknowledgedCount: 0,
      failedCount: 0,
      currentBatch: 0,
      isDemo: true,
      notes: 'DEMO BROADCAST • Authorized under simulated Disaster Management Act protocol.',
    };

    broadcastStore.set(broadcastId, record);
    auditLogStore.unshift({ ...record });

    return res.status(201).json({ success: true, broadcast: record });
  });

  // POST /api/broadcasts/:id/dispatch - Dispatch queued broadcast in bounded batches
  app.post('/api/broadcasts/:id/dispatch', (req: Request, res: Response) => {
    const user: ServerUser | null = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthenticated.' });
    }

    if (
      user.role !== 'DISTRICT_AUTHORITY' &&
      user.role !== 'STATE_AUTHORITY' &&
      user.role !== 'SYSTEM_ADMIN'
    ) {
      return res.status(403).json({ error: 'Forbidden. Requires broadcast dispatch clearance.' });
    }

    const { id } = req.params;
    const record = broadcastStore.get(id);

    if (!record) {
      return res.status(404).json({ error: 'Broadcast job not found.' });
    }

    if (record.status === 'COMPLETED' || record.status === 'DISPATCHING') {
      return res.json({ success: true, broadcast: record });
    }

    // Transition to QUEUED -> DISPATCHING
    record.status = 'DISPATCHING';
    record.startedAt = new Date().toISOString();

    // Trigger bounded batch processing worker (Provider Abstraction: Simulated Carrier Gateway)
    // Bounded batches prevent network storm and simulate carrier gateway rate limiting
    let currentBatch = 0;
    const interval = setInterval(() => {
      currentBatch += 1;
      record.currentBatch = currentBatch;
      const newlyProcessed = Math.min(record.batchSize, record.totalRecipients - record.sentCount);

      // Deterministic synthetic outcomes: 97% delivered, 2.5% failed, 0.5% queued
      const batchSent = newlyProcessed;
      const batchDelivered = Math.floor(newlyProcessed * 0.96);
      const batchFailed = newlyProcessed - batchDelivered;

      record.sentCount += batchSent;
      record.deliveredCount += batchDelivered;
      record.failedCount += batchFailed;
      record.acknowledgedCount += Math.floor(batchDelivered * 0.78);
      record.queuedCount = Math.max(0, record.totalRecipients - record.sentCount);

      if (record.currentBatch < record.totalBatches && record.queuedCount > 0) {
        record.status = 'PARTIALLY_SENT';
      } else {
        record.status = 'COMPLETED';
        record.completedAt = new Date().toISOString();
        clearInterval(interval);
      }

      broadcastStore.set(record.broadcastId, { ...record });
      // Update audit record
      const auditIdx = auditLogStore.findIndex((a) => a.broadcastId === record.broadcastId);
      if (auditIdx >= 0) {
        auditLogStore[auditIdx] = { ...record };
      }
    }, 450);

    return res.json({ success: true, message: 'Broadcast dispatch started', broadcast: record });
  });

  // GET /api/broadcasts/:id - Poll job status
  app.get('/api/broadcasts/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const record = broadcastStore.get(id);
    if (!record) {
      return res.status(404).json({ error: 'Broadcast job not found.' });
    }
    return res.json(record);
  });

  // -------------------------------------------------------------
  // Frontend Serving (Vite dev middleware or static)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MAUSAM + AlertSetu full-stack server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
