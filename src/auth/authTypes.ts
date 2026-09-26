/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'PUBLIC_USER'
  | 'FIELD_OPERATOR'
  | 'DISTRICT_AUTHORITY'
  | 'STATE_AUTHORITY'
  | 'SYSTEM_ADMIN';

export interface AuthUser {
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

export type PermissionAction =
  | 'VIEW_WEATHER'
  | 'VIEW_FORECAST'
  | 'VIEW_WARNINGS'
  | 'VIEW_RADAR'
  | 'VIEW_CYCLONE'
  | 'VIEW_AQI'
  | 'VIEW_ALERTSETU'
  | 'OPERATE_ALERTSETU_DELIVERY'
  | 'OPERATE_OFFLINE_RELAY'
  | 'SUBMIT_COMMUNITY_NOTE'
  | 'CREATE_DISTRICT_BROADCAST'
  | 'AUTHORIZE_DISTRICT_BROADCAST'
  | 'CREATE_STATE_BROADCAST'
  | 'AUTHORIZE_STATE_BROADCAST'
  | 'VIEW_AUDIT_LOGS'
  | 'MANAGE_USERS'
  | 'SYSTEM_ADMINISTRATION';

export const ROLE_PERMISSIONS: Record<UserRole, PermissionAction[]> = {
  PUBLIC_USER: [
    'VIEW_WEATHER',
    'VIEW_FORECAST',
    'VIEW_WARNINGS',
    'VIEW_RADAR',
    'VIEW_CYCLONE',
    'VIEW_AQI',
    'VIEW_ALERTSETU',
  ],
  FIELD_OPERATOR: [
    'VIEW_WEATHER',
    'VIEW_FORECAST',
    'VIEW_WARNINGS',
    'VIEW_RADAR',
    'VIEW_CYCLONE',
    'VIEW_AQI',
    'VIEW_ALERTSETU',
    'OPERATE_ALERTSETU_DELIVERY',
    'OPERATE_OFFLINE_RELAY',
    'SUBMIT_COMMUNITY_NOTE',
  ],
  DISTRICT_AUTHORITY: [
    'VIEW_WEATHER',
    'VIEW_FORECAST',
    'VIEW_WARNINGS',
    'VIEW_RADAR',
    'VIEW_CYCLONE',
    'VIEW_AQI',
    'VIEW_ALERTSETU',
    'OPERATE_ALERTSETU_DELIVERY',
    'OPERATE_OFFLINE_RELAY',
    'SUBMIT_COMMUNITY_NOTE',
    'CREATE_DISTRICT_BROADCAST',
    'AUTHORIZE_DISTRICT_BROADCAST',
    'VIEW_AUDIT_LOGS',
  ],
  STATE_AUTHORITY: [
    'VIEW_WEATHER',
    'VIEW_FORECAST',
    'VIEW_WARNINGS',
    'VIEW_RADAR',
    'VIEW_CYCLONE',
    'VIEW_AQI',
    'VIEW_ALERTSETU',
    'OPERATE_ALERTSETU_DELIVERY',
    'OPERATE_OFFLINE_RELAY',
    'SUBMIT_COMMUNITY_NOTE',
    'CREATE_DISTRICT_BROADCAST',
    'AUTHORIZE_DISTRICT_BROADCAST',
    'CREATE_STATE_BROADCAST',
    'AUTHORIZE_STATE_BROADCAST',
    'VIEW_AUDIT_LOGS',
  ],
  SYSTEM_ADMIN: [
    'VIEW_WEATHER',
    'VIEW_FORECAST',
    'VIEW_WARNINGS',
    'VIEW_RADAR',
    'VIEW_CYCLONE',
    'VIEW_AQI',
    'VIEW_ALERTSETU',
    'OPERATE_ALERTSETU_DELIVERY',
    'OPERATE_OFFLINE_RELAY',
    'SUBMIT_COMMUNITY_NOTE',
    'CREATE_DISTRICT_BROADCAST',
    'AUTHORIZE_DISTRICT_BROADCAST',
    'CREATE_STATE_BROADCAST',
    'AUTHORIZE_STATE_BROADCAST',
    'VIEW_AUDIT_LOGS',
    'MANAGE_USERS',
    'SYSTEM_ADMINISTRATION',
  ],
};

export function hasPermission(role: UserRole, action: PermissionAction): boolean {
  const allowed = ROLE_PERMISSIONS[role];
  return !!allowed && allowed.includes(action);
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'PUBLIC_USER':
      return 'Public User';
    case 'FIELD_OPERATOR':
      return 'Field Operator';
    case 'DISTRICT_AUTHORITY':
      return 'District Authority';
    case 'STATE_AUTHORITY':
      return 'State Authority';
    case 'SYSTEM_ADMIN':
      return 'System Admin';
    default:
      return role;
  }
}

export const DEFAULT_DEMO_USERS: Record<string, AuthUser> = {
  'district.khordha@mausam.gov.in': {
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
  'osdma.state@mausam.gov.in': {
    id: 'usr-osdma-state-01',
    email: 'osdma.state@mausam.gov.in',
    name: 'Smt. Ananya Mohapatra, IAS',
    role: 'STATE_AUTHORITY',
    designation: 'Special Relief Commissioner, OSDMA',
    jurisdiction: 'Odisha State Apex Command',
    state: 'Odisha',
    badgeNumber: 'OD-SDMA-2026-003',
  },
  'operator.bhubaneswar@mausam.gov.in': {
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
  'citizen@mausam.gov.in': {
    id: 'usr-public-001',
    email: 'citizen@mausam.gov.in',
    name: 'Priyanka Senapati',
    role: 'PUBLIC_USER',
    designation: 'Registered Coastal Resident',
    jurisdiction: 'Public Weather Portal',
    state: 'Odisha',
    district: 'Puri',
  },
  'admin@mausam.gov.in': {
    id: 'usr-admin-sys-00',
    email: 'admin@mausam.gov.in',
    name: 'Rajesh Kumar Verma',
    role: 'SYSTEM_ADMIN',
    designation: 'Principal Meteorological Systems Architect',
    jurisdiction: 'National Core Grid & AlertSetu Gateways',
    state: 'National',
    badgeNumber: 'IMD-SYS-001',
  },
};
