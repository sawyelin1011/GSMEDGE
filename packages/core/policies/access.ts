// Access Control Policy - Data-Driven Permissions
// All roles and permissions are configurable, not hard-coded

export type RoleType = 'super_admin' | 'admin' | 'distributor' | 'reseller' | 'web_owner' | 'customer';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
}

export interface RolePolicy {
  role: RoleType;
  permissions: Permission[];
  canImpersonate: boolean;
  canManageRoles: boolean;
  canViewAnalytics: boolean;
}

// Default policies - can be overridden per tenant
const DEFAULT_POLICIES: Record<RoleType, RolePolicy> = {
  super_admin: {
    role: 'super_admin',
    permissions: [
      { resource: 'tenant', action: 'create' },
      { resource: 'tenant', action: 'read' },
      { resource: 'tenant', action: 'update' },
      { resource: 'tenant', action: 'delete' },
      { resource: 'user', action: 'create' },
      { resource: 'user', action: 'read' },
      { resource: 'user', action: 'update' },
      { resource: 'user', action: 'delete' },
      { resource: 'provider', action: 'create' },
      { resource: 'provider', action: 'read' },
      { resource: 'provider', action: 'update' },
      { resource: 'provider', action: 'delete' },
      { resource: 'pricing', action: 'update' },
      { resource: 'wallet', action: 'read' },
      { resource: 'wallet', action: 'update' },
    ],
    canImpersonate: true,
    canManageRoles: true,
    canViewAnalytics: true,
  },
  admin: {
    role: 'admin',
    permissions: [
      { resource: 'user', action: 'read' },
      { resource: 'user', action: 'update' },
      { resource: 'provider', action: 'read' },
      { resource: 'provider', action: 'update' },
      { resource: 'order', action: 'read' },
      { resource: 'wallet', action: 'read' },
    ],
    canImpersonate: false,
    canManageRoles: false,
    canViewAnalytics: true,
  },
  distributor: {
    role: 'distributor',
    permissions: [
      { resource: 'user', action: 'read' },
      { resource: 'provider', action: 'read' },
      { resource: 'order', action: 'create' },
      { resource: 'order', action: 'read' },
      { resource: 'wallet', action: 'read' },
    ],
    canImpersonate: false,
    canManageRoles: false,
    canViewAnalytics: true,
  },
  reseller: {
    role: 'reseller',
    permissions: [
      { resource: 'user', action: 'read' },
      { resource: 'provider', action: 'read' },
      { resource: 'order', action: 'create' },
      { resource: 'order', action: 'read' },
      { resource: 'wallet', action: 'read' },
    ],
    canImpersonate: false,
    canManageRoles: false,
    canViewAnalytics: false,
  },
  web_owner: {
    role: 'web_owner',
    permissions: [
      { resource: 'provider', action: 'read' },
      { resource: 'order', action: 'create' },
      { resource: 'order', action: 'read' },
      { resource: 'wallet', action: 'read' },
    ],
    canImpersonate: false,
    canManageRoles: false,
    canViewAnalytics: false,
  },
  customer: {
    role: 'customer',
    permissions: [
      { resource: 'order', action: 'create' },
      { resource: 'order', action: 'read' },
      { resource: 'wallet', action: 'read' },
    ],
    canImpersonate: false,
    canManageRoles: false,
    canViewAnalytics: false,
  },
};

export function getPolicy(role: RoleType): RolePolicy {
  return DEFAULT_POLICIES[role];
}

export function canAccess(role: RoleType, resource: string, action: Permission['action']): boolean {
  const policy = getPolicy(role);
  return policy.permissions.some(
    (p) => p.resource === resource && p.action === action
  );
}
