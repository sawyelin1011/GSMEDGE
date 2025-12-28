// Core Domain Models - Runtime Agnostic
// Used across all runtime adapters

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended';
  config: Record<string, any>;
  createdAt?: Date;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'distributor' | 'reseller' | 'web_owner' | 'customer';
  passwordHash: string;
  createdAt?: Date;
}

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
  createdAt?: Date;
}

export interface ApiKey {
  id: string;
  tenantId: string;
  userId: string;
  key: string;
  scopes: string[];
  lastUsedAt?: Date;
  expiresAt?: Date;
}

export interface Wallet {
  id: string;
  tenantId: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt?: Date;
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  type: 'imei' | 'digital' | 'remote_file';
  provider: string;
  pricing: Record<string, number>;
  isActive: boolean;
  createdAt?: Date;
}

export interface Order {
  id: string;
  tenantId: string;
  userId: string;
  serviceId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalAmount: number;
  paidAmount: number;
  currency: string;
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
