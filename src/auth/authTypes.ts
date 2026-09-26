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
