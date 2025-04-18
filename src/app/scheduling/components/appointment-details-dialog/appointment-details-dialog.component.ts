import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms'; // Import FormBuilder and FormGroup
import { SchedulingService } from '../../service/scheduling.service'; // Import the scheduling service
import { ToastrService } from 'ngx-toastr'; // Import Toastr service for error messages
import { Data } from '@angular/router';
import { RequirementService } from 'src/app/requirements/service/requirement.service';

@Component({
  selector: 'app-appointment-details-dialog',
  standalone: true,
  imports: [],
  templateUrl: './appointment-details-dialog.component.html',
  styleUrls: ['./appointment-details-dialog.component.css'],
})
export class AppointmentDetailsDialogComponent {
  // Declare variables to hold form and list data
  messageTitle: string = '';
  appointmentList: any[] = [];
  pageableData: any = {
    page: 0,
    size: 10, // Set page size or any other necessary properties
  };

  // Declare the form group for the appointment search form
  appointmentForm: FormGroup;

  // Inject services into the component
  constructor(
    public dialogRef: MatDialogRef<AppointmentDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private requirementService: RequirementService,
    private ScheduleService: SchedulingService,
    private toaster: ToastrService, // Inject ToastrService
    private fb: FormBuilder // Inject FormBuilder to create the form
  ) {
    // Initialize the form with a control for the 'appointmentSearch' field
    this.appointmentForm = this.fb.group({
      appointmentSearch: [''], // Set initial value for the search field
    });
  }
  ngOnInit(): void {
    console.log(this.data);
    this.searchAppointment(false);
  }

  // Close dialog function
  closeDialog(): void {
    this.dialogRef.close();
  }

  searchAppointment(clearData: boolean) {
    this.pageableData.messageTitle = this.appointmentForm.get('appointmentSearch')?.value;
    if (clearData) {
      this.appointmentList = [];
      this.pageableData.page = 0;
    }
    this.ScheduleService.searchAppointment(this.pageableData).subscribe({
      next: responseData => {
        this.appointmentList = responseData;
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Data';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }
}
