import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/services/master/permission/permission.service';
import { FeatureGroup } from '../../model/feature-group.model';
import { ToastrService } from 'ngx-toastr';
import { Feature } from '../../model/feature.model';
import { FeatureAction } from '../../model/feature-action.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/components/user/user.service';
import { User } from 'src/app/user/model/user.model';
import { UserPermission } from '../../model/user-permission.model';
import { Role } from '../../model/role.model';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { Router } from '@angular/router';
import { MasterSelectType } from 'src/app/models/master.select-type.model';
import { EmployeeSearchDto } from 'src/app/user-and-group/models/employee-search.model';
import { RolesService } from 'src/app/user-and-group/components/service/roles/roles.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-manage-permission',
  templateUrl: './manage-permission.component.html',
  styleUrls: ['./manage-permission.component.css'],
})
export class ManagePermissionComponent implements OnInit {
  permissionData: FeatureGroup[] = [];
  featureList: Feature[] = [];
  permissionForm: FormGroup;
  userData: User[] = [];
  roleData: Role[] = [];
  isApprovals: boolean = false;
  designationData: MasterSelectType[] = [];
  departmentsData: MasterSelectType[] = [];
  isUserSelected: boolean = false;
  pageableData: EmployeeSearchDto = {
    page: -1,
    size: -1,
    orderBy: 'policy_number',
    includeAllUser: true,
  };
  constructor(
    private permissionService: PermissionService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private userService: UserService,
    private userSharedDataService: UserSharedDataService,
    private router: Router,
    private rolesService: RolesService
  ) {
    this.permissionForm = this.fb.group({
      selectAll: [false],
      role: ['All'],
      user: ['All', Validators.required],
    });
    if (this.router.url.indexOf('manageApprovals') != -1) {
      this.isApprovals = true;
    }
  }
  ngOnInit(): void {
    this.fetchPermission();
    this.fetchRoles();
  }
  onUserChange($event: any) {
    this.isUserSelected = true;
    this.resetPermission();
    this.permissionService.getUserPermission(this.permissionForm.get('user')?.value).subscribe({
      next: responseData => {
        if (responseData && responseData.userPermissionList.length > 0) {
          responseData.userPermissionList.forEach((userPermission: UserPermission) => {
            if (userPermission.permissionValue) {
              this.permissionForm
                .get(userPermission.featureId.toString())
                ?.get(userPermission.actionId.toString())
                ?.setValue(userPermission.permissionValue, { emitEvent: false });
            }
          });
        }
      },
      error: error => {
        this.toaster.error('Unable to load User Permission data', 'Error!');
      },
    });
  }
  resetPermission() {
    this.permissionData.forEach((groupItem: FeatureGroup) => {
      groupItem.featureList.forEach((feauteItem: Feature) => {
        feauteItem.featureActionList.forEach((featureActionItem: FeatureAction) => {
          this.permissionForm.get(feauteItem.featureId.toString())?.get(featureActionItem.actionId.toString())?.setValue(false, { emitEvent: false });
        });
      });
    });
  }
  fetchPermission() {
    this.permissionService.fetchPermission().subscribe({
      next: responseData => {
        this.permissionData = responseData;
        if (this.isApprovals) {
          var groupList: FeatureGroup[] = [];
          this.permissionData.forEach((groupItem: FeatureGroup) => {
            var feauteList: Feature[] = [];
            groupItem.featureList.forEach((feauteItem: Feature) => {
              var actionArray = feauteItem.featureActionList.filter(
                (featureActionItem: FeatureAction) =>
                  featureActionItem.actionDisplayName.indexOf('Approve') != -1 || featureActionItem.actionDisplayName.indexOf('Reject') != -1
              );
              if (actionArray && actionArray.length > 0) {
                feauteItem.featureActionList = actionArray;
                feauteList.push(feauteItem);
              }
            });
            if (feauteList.length > 0) {
              groupItem.featureList = feauteList;
              groupList.push(groupItem);
            }
          });
          this.permissionData = groupList;
        } else {
          var groupList: FeatureGroup[] = [];
          this.permissionData.forEach((groupItem: FeatureGroup) => {
            var feauteList: Feature[] = [];
            groupItem.featureList.forEach((feauteItem: Feature) => {
              var actionArray = feauteItem.featureActionList.filter(
                (featureActionItem: FeatureAction) =>
                  featureActionItem.actionDisplayName.indexOf('Approve') == -1 && featureActionItem.actionDisplayName.indexOf('Reject') == -1
              );
              if (actionArray && actionArray.length > 0) {
                feauteItem.featureActionList = actionArray;
                feauteList.push(feauteItem);
              }
            });
            if (feauteList.length > 0) {
              groupItem.featureList = feauteList;
              groupList.push(groupItem);
            }
          });
          this.permissionData = groupList;
        }
        this.initFeatureList();
      },
      error: error => {
        this.toaster.error('Unable to Load Permission data', 'Error!');
      },
    });
  }
  fetchRoles() {
    this.rolesService.getRoles().subscribe({
      next: responseData => {
        this.roleData = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load Permission data', 'Error!');
      },
    });
  }
  initFeatureList() {
    this.featureList = [];
    this.permissionData.forEach((groupItem: FeatureGroup) => {
      groupItem.featureList.forEach((feauteItem: Feature) => {
        feauteItem.featureGroupId = groupItem.groupId;
        var featureActionControl: any = {
          all: [false],
        };
        feauteItem.featureActionList.forEach((featureActionItem: FeatureAction) => {
          featureActionItem.featureId = feauteItem.featureId;
          featureActionControl[featureActionItem.actionId] = [false];
        });
        this.permissionForm.addControl(feauteItem.featureId.toString(), this.fb.group(featureActionControl));
        this.initFeaturePermissionChanges(feauteItem.featureId.toString());
        this.initChildActionPermissionChanges(feauteItem.featureId.toString(), featureActionControl);
        this.featureList.push(feauteItem);
      });
    });
    this.initAllPermissionChanges();
  }
  onGroupClick(group: FeatureGroup, $event, type: string) {
    this.initFeatureList();
    let groupsList: string[] = [];
    this.permissionData.forEach((groupItem: FeatureGroup) => {
      if (type == 'All') {
        $('#' + groupItem.groupId).prop('checked', $event.target.checked);
        groupsList.push(groupItem.groupId);
      } else if (($event.target.checked && group.groupId === groupItem.groupId) || $('#' + groupItem.groupId).is(':checked')) {
        groupsList.push(groupItem.groupId);
      }
    });
    this.featureList = this.featureList.filter((feauteItem: Feature) => {
      return groupsList.length == 0 || groupsList.indexOf(feauteItem.featureGroupId) != -1;
    });
  }

  getNonPartnerAllUser() {
    if (this.permissionForm.get('role')?.value && this.permissionForm.get('role')?.value != 'All') {
      this.pageableData.role = this.permissionForm.get('role')?.value;
    } else {
      delete this.pageableData.role;
    }
    this.pageableData.excludeBranchAndDept = true;
    this.userService.searchAirman(this.pageableData).subscribe({
      next: responseData => {
        this.userData = responseData;
      },
      error: error => {
        this.toaster.error('Unable to Load User data', 'Error!');
      },
    });
  }

  initChildActionPermissionChanges(featureId: string, featureActionControl: any) {
    Object.keys(featureActionControl).forEach(element => {
      if (element != 'all') {
        this.permissionForm
          .get(featureId)
          ?.get(element)
          ?.valueChanges.subscribe(selectedValue => {
            const control = this.permissionForm.get(featureId);
            if (control instanceof FormGroup) {
              var count = 0;
              Object.keys(control.controls).forEach(element => {
                if (element != 'all' && control.get(element)?.value) {
                  count++;
                }
              });
              if (Object.keys(control.controls).length - 1 != count) {
                this.permissionForm.get(featureId)?.get('all')?.setValue(false, { emitEvent: false });
              }
            }
          });
      }
    });
  }
  getFeatureIdControls(featureId: string): FormArray {
    return this.permissionForm.get(featureId) as FormArray;
  }

  initFeaturePermissionChanges(featureId: string) {
    this.permissionForm
      .get(featureId)
      ?.get('all')
      ?.valueChanges.subscribe(selectedValue => {
        const control = this.permissionForm.get(featureId);
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(element => {
            if (element != 'all') {
              control.get(element)?.setValue(selectedValue, { emitEvent: false });
            }
          });
        }
      });
  }
  initAllPermissionChanges() {
    this.permissionForm.get('selectAll')?.valueChanges.subscribe(selectedValue => {
      for (const field in this.permissionForm.controls) {
        var features = this.featureList.filter(featureItem => featureItem.featureId.toString() == field);
        if (features.length > 0) {
          const control = this.permissionForm.get(field);
          if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(element => {
              control.get(element)?.setValue(selectedValue, { emitEvent: false });
            });
          }
        }
      }
    });
  }

  savePermission() {
    if (this.isApprovals) {
      if (!this.userSharedDataService.hasAccess('Manage Permission', 'Approval Management', 'Edit')) {
        this.toaster.error("You don't have access to edit Employee Permission", 'Error!');
        return;
      }
    } else {
      if (!this.userSharedDataService.hasAccess('Manage Permission', 'Permission Management', 'Edit')) {
        this.toaster.error("You don't have access to edit Employee Permission", 'Error!');
        return;
      }
    }
    this.permissionForm.markAllAsTouched();
    if (!this.permissionForm.valid) {
      window.scroll(0, 0);
      this.toaster.error('Please select all required fields', 'Error!');
      return;
    }
    const role =
      this.permissionForm.get('role')?.value && this.permissionForm.get('role')?.value != 'All' ? this.permissionForm.get('role')?.value : '';
    const roleObjects = this.roleData.filter(roleItem => (roleItem.name = role));
    let roleId = '';
    if (roleObjects && roleObjects.length > 0) {
      roleId = roleObjects[0].roleId;
    }
    var userPermissionPayload: UserPermission[] = [];
    this.permissionData.forEach((groupItem: FeatureGroup) => {
      groupItem.featureList.forEach((feauteItem: Feature) => {
        feauteItem.featureGroupId = groupItem.groupId;
        feauteItem.featureActionList.forEach((featureActionItem: FeatureAction) => {
          featureActionItem.featureId = feauteItem.featureId;
          const isEnabled: boolean = this.permissionForm.get(feauteItem.featureId.toString())?.get(featureActionItem.actionId.toString())?.value;
          if (isEnabled) {
            var permissionObj: UserPermission = {
              userId: this.permissionForm.get('user')?.value,
              roleId: roleId,
              groupId: groupItem.groupId,
              featureId: feauteItem.featureId,
              actionId: featureActionItem.actionId,
              permissionValue: isEnabled,
            };
            userPermissionPayload.push(permissionObj);
          }
        });
      });
    });
    if (this.isApprovals) {
      this.permissionService.updateUserPermissionApproval(this.permissionForm.get('user')?.value, userPermissionPayload).subscribe({
        next: responseData => {
          this.toaster.success('User Permission data save/Updated successfully', 'Success!');
          if (this.userSharedDataService.getUserId() == this.permissionForm.get('user')?.value) {
            this.permissionService.getUserPermission(this.userSharedDataService.getUserId()).subscribe({
              next: responseData => {
                this.userSharedDataService.setUserPermission(responseData);
                window.location.reload();
              },
              error: error => {},
            });
          }
        },
        error: error => {
          this.toaster.error('Unable to save/Update Permission data', 'Error!');
        },
      });
    } else {
      this.permissionService.updateUserPermission(this.permissionForm.get('user')?.value, userPermissionPayload).subscribe({
        next: responseData => {
          this.toaster.success('User Permission data save/Updated successfully', 'Success!');
          if (this.userSharedDataService.getUserId() == this.permissionForm.get('user')?.value) {
            this.permissionService.getUserPermission(this.userSharedDataService.getUserId()).subscribe({
              next: responseData => {
                this.userSharedDataService.setUserPermission(responseData);
                window.location.reload();
              },
              error: error => {},
            });
          }
        },
        error: error => {
          this.toaster.error('Unable to save/Update Permission data', 'Error!');
        },
      });
    }
  }
  getUserName() {
    let data = this.userData.filter(userEL => userEL.id === this.permissionForm.get('user')?.value);
    return data && data.length > 0 ? data[0].fullName : '';
  }
}
