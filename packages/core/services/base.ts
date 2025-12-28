// Base Service Interface - All services implement this
// Business logic is isolated from framework

import type { ServiceResponse } from '../types';

export interface IService {
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}

export abstract class BaseService implements IService {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  async initialize(): Promise<void> {
    console.log(`[${this.name}] Initialized`);
  }

  async shutdown(): Promise<void> {
    console.log(`[${this.name}] Shutting down`);
  }

  protected success<T>(data: T): ServiceResponse<T> {
    return { success: true, data };
  }

  protected error(code: string, message: string): ServiceResponse<any> {
    return {
      success: false,
      error: { code, message }
    };
  }
}
