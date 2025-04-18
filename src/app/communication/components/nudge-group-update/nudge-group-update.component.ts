import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NudgeGroupsService } from '../../service/nudgeGroups/nudge-groups.service';
import { NudgeGroup } from '../../model/nudgeGroup.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nudge-group-update',
  templateUrl: './nudge-group-update.component.html',
  styleUrls: ['./nudge-group-update.component.css'],
})
export class NudgeGroupUpdateComponent implements OnInit {
  nudgeGroupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private nudgeGroupsService: NudgeGroupsService,
    public dialogRef: MatDialogRef<NudgeGroupUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { messageGroupId: string }
  ) {
    this.nudgeGroupForm = this.fb.group({
      messageGroupId: [''],
      messageGroupName: ['', Validators.required],
      messageGroupDesc: ['', Validators.required],
      createdBy: [''],
      updatedBy: [''],
      createdAt: [''],
      updatedAt: [''],
      isDelete: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data.messageGroupId) {
      this.getNudgeGroupDetails(this.data.messageGroupId);
    }
  }

  getNudgeGroupDetails(messageGroupId: string): void {
    this.nudgeGroupsService.getNudgeGroupById(messageGroupId).subscribe({
      next: (response: NudgeGroup) => {
        this.nudgeGroupForm.patchValue(response);
      },
      error: error => {
        console.error('Error fetching Nudge Group:', error);
      },
    });
  }

  updateNudgeGroup(): void {
    if (this.nudgeGroupForm.invalid) {
      this.toastr.error('Please fill out all required fields.');
      this.nudgeGroupForm.markAllAsTouched();
      return;
    }

    const updatedData = this.nudgeGroupForm.value;
    this.nudgeGroupsService.updateNudgeGroup(updatedData).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: error => {
        console.error('Error updating Nudge Group:', error);
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
