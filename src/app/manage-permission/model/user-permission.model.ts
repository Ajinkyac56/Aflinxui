export interface UserPermission {
  id?: string;
  userId: string;
  groupId: string;
  featureId: string;
  actionId: string;
  roleId: string;
  permissionValue: boolean;
}
