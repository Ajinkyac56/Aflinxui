import { Injectable } from '@angular/core';
import { UserPermissionResponse } from 'src/app/manage-permission/model/user-permission-response.model';
import { User } from 'src/app/user/model/user.model';
import { MasterSelectTypeService } from '../../master/master-select-type.service';
import { SELECT_TYPE } from 'src/app/models/master.select-type.model';

@Injectable({
  providedIn: 'root',
})
export class UserSharedDataService {
  user: User | undefined;
  userPermission: UserPermissionResponse | undefined;
  userBranchIds: string[] = [];
  userAreaIds: string[] = [];
  userRegionIds: string[] = [];

  constructor(private masterSelectTypeService: MasterSelectTypeService) {}
  setUserDetails(userObj: User) {
    localStorage.setItem('aflinxLoggedInUser', JSON.stringify(userObj));
  }

  getUserId() {
    if (this.user) {
      return this.user.id;
    } else {
      var userObj: any = localStorage.getItem('aflinxLoggedInUser')?.toString();
      this.user = JSON.parse(userObj);
      return this.user?.id;
    }
  }

  isUserType() {
    return this.getUserDetails()?.userType === 'ADMIN';
  }

  setUserPermission(userPermissionObj: UserPermissionResponse) {
    localStorage.setItem('aflinxLoggedInUserPermission', JSON.stringify(userPermissionObj));
  }

  getUserPermission(): UserPermissionResponse {
    if (this.userPermission) {
      return this.userPermission;
    } else {
      var userObj: any = localStorage.getItem('aflinxLoggedInUserPermission')?.toString();
      const userPermissionObj: UserPermissionResponse = JSON.parse(userObj);
      this.userPermission = userPermissionObj;
      return userPermissionObj;
    }
  }
  hasAccess(featureGroupName: string | undefined, featureName: string | undefined, actionName: string | undefined) {
    var hasAccess = false;
    const featureGroup = this.getUserPermission().featureGroupList.filter(featureGroupObj => featureGroupObj.groupName == featureGroupName);
    if (featureGroup.length == 1) {
      const feature = featureGroup[0].featureList.filter(feature => feature.featureName == featureName);
      if (feature.length == 1) {
        const action = feature[0].featureActionList.filter(action => action.actionName == actionName);
        if (action.length == 1) {
          hasAccess = action[0].permissionValue;
        }
      }
    }
    return hasAccess;
  }
  logout() {
    localStorage.removeItem('aflinxLoggedInUser');
    localStorage.removeItem('aflinxLoggedInUserPermission');
  }
  getUserDetails(): User | undefined {
    if (this.user) {
      return this.user;
    } else {
      var userObj: any = localStorage.getItem('aflinxLoggedInUser')?.toString();
      this.user = JSON.parse(userObj);
      return this.user;
    }
  }
}
