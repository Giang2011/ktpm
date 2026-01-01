export interface AuditLog {
    id: number;
    actor: string;
    action: string;
    entityName: string;
    entityId: number;
    oldData?: string;
    newData?: string;
    createdAt: string;
  }