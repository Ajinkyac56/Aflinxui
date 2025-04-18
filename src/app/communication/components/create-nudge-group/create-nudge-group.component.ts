import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NudgeGroup } from '../../model/nudgeGroup.model';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/user/model/user.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { EmployeeSearchDto } from 'src/app/user-and-group/models/employee-search.model';
import { UserService } from 'src/app/services/components/user/user.service';
import { CommunicationService } from '../../service/communication.service';
import { Router } from '@angular/router';
import { NudgeGroupsService } from '../../service/nudgeGroups/nudge-groups.service';
@Component({
  selector: 'app-create-nudge-group',
  templateUrl: './create-nudge-group.component.html',
  styleUrls: ['./create-nudge-group.component.css'],
})
export class CreateNudgeGroupComponent implements OnInit {
  createNudgeGroup: FormGroup;
  currentTab = 1;
  displayedUsers: User[] = [];
  itemsPerPage = 10;
  formSubmitted = false;
  airmen: User[] = [];
  loading: boolean = false;
  error: string | null = null;
  selectData: User[] = [];
  dataUserRecord: User[] = [];
  datafilerecords: User[] = [];

  pageableData: EmployeeSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    employeeName: '',
  };
  canLoadMore: boolean;
  isEdit: any;

  constructor(
    private fb: FormBuilder,
    private nudgeGroupsService: NudgeGroupsService,
    private userService: UserService,
    private toaster: ToastrService,
    private router: Router
  ) {
    this.createNudgeGroup = this.fb.group({
      messageGroupName: ['', Validators.required],
      messageGroupDesc: [''],
      userName: [''],
      selectedUsers: this.fb.array([]), // Fixed: Initialize selected users array
    });
  }

  ngOnInit(): void {
    this.searchUserNudgeGroup(true);
    this.createNudgeGroup.get('userName')?.valueChanges.subscribe(value => {
      if (value === '') {
        this.searchUserNudgeGroup(true);
      }
    });
  }

  // Load more users for pagination
  loadMore(): void {
    this.pageableData.page += 1;
    this.searchUserNudgeGroup(false); // Fixed: Do not reset data
  }

  // Toggle user selection
  toggleSelection(user: User): void {
    const selectedUsers = this.createNudgeGroup.get('selectedUsers') as FormArray;
    const index = selectedUsers.controls.findIndex(control => control.value === user.id);

    if (index >= 0) {
      selectedUsers.removeAt(index);
      this.selectData = this.selectData.filter(u => u.id !== user.id);
    } else {
      selectedUsers.push(this.fb.control(user.id));
      this.selectData.push(user);
    }
  }

  // Check if the user is selected
  isSelected(userId: number): boolean {
    const selectedUsers = this.createNudgeGroup.get('selectedUsers') as FormArray;
    return selectedUsers.controls.some(control => control.value === userId);
  }

  // Navigate to next tab if form is valid
  nextTab(): void {
    if (!this.isFormValid()) {
      this.createNudgeGroup.markAllAsTouched();
      return;
    }
    this.currentTab++;
  }

  // Move to the previous tab
  previousTab(): void {
    if (this.currentTab > 1) {
      this.currentTab--;
    }
  }

  // Check if form is valid
  isFormValid(): boolean {
    return this.createNudgeGroup.valid;
  }

  submitForm(): void {
    const selectedUsers = this.createNudgeGroup.get('selectedUsers') as FormArray;
    if (this.selectData.length === 0) {
      this.toaster.error('Please select at least one user before submitting.', 'Error!');
      return; // Prevent form submission
    } else {
      this.saveNudgeGroupForm();
    }
  }
  // Save the Nudge Group
  saveNudgeGroupForm(): void {
    if (this.createNudgeGroup.valid) {
      const group: NudgeGroup = {
        messageGroupName: this.createNudgeGroup.get('messageGroupName')?.value,
        messageGroupDesc: this.createNudgeGroup.get('messageGroupDesc')?.value,
        groupUserList: this.selectData.map(user => user.id),
        messageGroupId: '',
        createdAt: '',
        updatedAt: '',
        createdBy: '',
        updatedBy: '',
        isDelete: 0,
      };

      this.nudgeGroupsService.saveNudgeGroup(group).subscribe({
        next: response => {
          this.toaster.success(response.msg || 'Nudge Group created successfully!', 'Success!');
          this.router.navigate(['/dashboard/communication/nudge-groups']);
        },
        error: errorResponse => {
          const errorMessage = errorResponse?.error?.msg || 'Failed to create Nudge Group';
          this.toaster.error(errorMessage, 'Error!');
        },
      });
    }
  }

  // Handle checkbox selection for users
  checkBoxValueClicked(event: any, type: string, item: User): void {
    const checkbox = event.target as HTMLInputElement;

    if (type === 'all') {
      const checkboxes = document.querySelectorAll('.insurer-table input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(chk => {
        chk.checked = checkbox.checked;
      });

      this.selectData = checkbox.checked ? [...this.datafilerecords] : [];
    } else {
      if (checkbox.checked) {
        this.selectData.push(item);
      } else {
        this.selectData = this.selectData.filter(user => user.id !== item.id);
      }
    }
  }

  // Search Users for Nudge Group
  searchUserNudgeGroup(clearData: boolean): void {
    this.pageableData.employeeName = this.createNudgeGroup.get('userName')?.value || '';

    if (clearData) {
      this.datafilerecords = [];
      this.pageableData.page = 0;
    }
    this.userService.searchAirman(this.pageableData).subscribe({
      next: (responseData: User[]) => {
        this.datafilerecords = [...this.datafilerecords, ...responseData]; // Append new records
        if (responseData.length < this.pageableData.size) {
          this.canLoadMore = false; // Disable the "Load More" button if less than 30
        } else {
          this.canLoadMore = true; // Enable the "Load More" button if exactly 30
        }
      },
      error: error => {
        console.error('Error fetching users:', error);
        this.toaster.error('Unable to load data', 'Error');
      },
    });
  }
  isUserSelected(user: User): boolean {
    return this.selectData.some(selectedUser => selectedUser.id === user.id);
  }
}
