import { FeatureGroup } from './feature-group.model';
import { UserPermission } from './user-permission.model';

export interface UserPermissionResponse {
  userPermissionList: UserPermission[];
  featureGroupList: FeatureGroup[];
}
