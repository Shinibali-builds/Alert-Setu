/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../auth/authTypes';

export type BroadcastStatus =
  | 'DRAFT'
  | 'AUTHORIZED'
  | 'QUEUED'
  | 'DISPATCHING'
  | 'PARTIALLY_SENT'
  | 'SENT'
  | 'COMPLETED'
  | 'FAILED';

export type BroadcastAudience =
  | 'General Public'
  | 'Low Literacy'
  | 'Older Adults'
  | 'People with Disabilities'
  | 'Visitors / New Residents';

export type BroadcastLanguage = 'English' | 'Hindi' | 'Odia' | 'Bengali' | 'Telugu';

export type BroadcastChannel =
  | 'SMS'
  | 'Web Notification'
  | 'Mobile Push'
  | 'Low-Bandwidth Web'
  | 'Offline Relay'
  | 'Community Radio';

export interface BroadcastTarget {
  state: string;
  district: string;
  blockArea: string;
  radiusKm: number;
}

export interface BroadcastRecord {
  broadcastId: string;
  initiatedBy: string;
  initiatorRole: UserRole;
  alertId: string;
  hazard: string;
  severity: string;
  headline: string;
  target: BroadcastTarget;
  audience: BroadcastAudience;
  languages: BroadcastLanguage[];
  channels: BroadcastChannel[];
  totalRecipients: number;
  batchSize: number;
  totalBatches: number;
  status: BroadcastStatus;
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

export interface RecipientGroupSummary {
  state: string;
  district: string;
  eligibleRecipients: number;
  batchSize: number;
  totalBatches: number;
  networkCarriers: { name: string; estimatedCoverage: string }[];
  isDemo: boolean;
}
