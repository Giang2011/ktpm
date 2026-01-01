import { AuditLog } from '@/lib/types/audit';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const auditApi = {
  getAll: async (): Promise<AuditLog[]> => {
    const response = await fetch(`${API_BASE_URL}/audit-logs`);
    if (!response.ok) throw new Error('Failed to fetch audit logs');
    return response.json();
  },

  getByEntity: async (entityName: string, entityId: number): Promise<AuditLog[]> => {
    const response = await fetch(
      `${API_BASE_URL}/audit-logs/entity?name=${encodeURIComponent(entityName)}&id=${entityId}`
    );
    if (!response.ok) throw new Error('Failed to fetch audit logs by entity');
    return response.json();
  },

  getByEntityName: async (entityName: string): Promise<AuditLog[]> => {
    const response = await fetch(`${API_BASE_URL}/audit-logs/entity-name/${encodeURIComponent(entityName)}`);
    if (!response.ok) throw new Error('Failed to fetch audit logs by entity name');
    return response.json();
  },

  getByActor: async (actor: string): Promise<AuditLog[]> => {
    const response = await fetch(`${API_BASE_URL}/audit-logs/actor/${encodeURIComponent(actor)}`);
    if (!response.ok) throw new Error('Failed to fetch audit logs by actor');
    return response.json();
  },

  getByAction: async (action: string): Promise<AuditLog[]> => {
    const response = await fetch(`${API_BASE_URL}/audit-logs/action/${encodeURIComponent(action)}`);
    if (!response.ok) throw new Error('Failed to fetch audit logs by action');
    return response.json();
  },

  getByDateRange: async (start: string, end: string): Promise<AuditLog[]> => {
    const response = await fetch(
      `${API_BASE_URL}/audit-logs/date-range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
    );
    if (!response.ok) throw new Error('Failed to fetch audit logs by date range');
    return response.json();
  },
};