import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentSlotDialogComponent } from '../appointment-slot-dialog/appointment-slot-dialog.component';
import { slotsSearchDto } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { SchedulingService } from '../../service/scheduling.service';
import { ToastrService } from 'ngx-toastr';
import { Slots } from '../../model/slots.model';
import { RequirementService } from 'src/app/requirements/service/requirement.service';
import { Requirement } from 'src/app/requirements/model/requirement.model';
import { SlotsService } from '../../service/slots.service';
import { faPenSquare, faEye } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrls: ['./slots.component.css'],
})
export class SlotsComponent implements OnInit {
  // icons
  editIcon = faPenSquare;
  viewIcon = faEye;

  slotsList: Slots[] = [];
  selectedSlots: Slots[] = [];
  requirementData: Requirement[] = [];
  requirementDataFiltered: Requirement[] = [];
  requirementSearchControl = new FormControl();
  searchForm: FormGroup;
  noMoreRecords: boolean = false;
  isView: boolean = false;
  pageableData: slotsSearchDto = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };
  expandAction: boolean;
  hasAccessToAdd: boolean = true;
  hasAccessToView: boolean = true;
  hasAccessToEdit: boolean = true;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private slotService: SlotsService,
    private toaster: ToastrService,
    private requirementService: RequirementService,
    private userSharedDataService: UserSharedDataService
  ) {
    this.searchForm = this.fb.group({
      requirementId: [''],
      startDate: [''],
      endDate: [''],
      appointmentType: [''],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.searchSlots(true);
    this.getAllRequirement();
    this.requirementSearchControl.valueChanges.subscribe(() => {
      this.requirementData = this.filteredRequirementList();
    });
  }

  hasAccess() {
    this.hasAccessToAdd = this.userSharedDataService.hasAccess('Manage Scheduling', 'Slots', 'Add');
    this.hasAccessToView = this.userSharedDataService.hasAccess('Manage Scheduling', 'Slots', 'View');
    this.hasAccessToEdit = this.userSharedDataService.hasAccess('Manage Scheduling', 'Slots', 'Edit');
  }

  searchSlots(clearData: boolean) {
    this.pageableData.requirementId = this.searchForm.get('requirementId')?.value;
    this.pageableData.startDate = this.searchForm.get('startDate')?.value;
    this.pageableData.endDate = this.searchForm.get('endDate')?.value;

    if (clearData) {
      this.slotsList = [];
      this.pageableData.page = 0;
    }

    this.slotService.searchSlots(this.pageableData).subscribe({
      next: responseData => {
        this.slotsList = [...this.slotsList, ...responseData];
      },
      error: error => {
        this.toaster.error('Unable to Load Slots Data', 'Error!');
      },
    });
  }

  getAllRequirement() {
    this.requirementService.getAllRequirements().subscribe({
      next: (data: Requirement[] | null) => {
        if (data && Array.isArray(data)) {
          this.requirementData = data;
          this.requirementDataFiltered = [...data];
        } else {
          this.requirementDataFiltered = [];
          this.requirementData = [];
          this.toaster.warning('No Data found.', 'Warning');
        }
      },
      error: err => {
        this.toaster.error('Failed to fetch Requirements.', 'Error');
        console.error('Error fetching users:', err);
      },
    });
  }

  filteredRequirementList() {
    const searchTerm = this.requirementSearchControl.value?.toLowerCase() || '';
    return this.requirementDataFiltered.filter(item => item.reqName.toLowerCase().includes(searchTerm));
  }
  getRequirementName(requirement_id: string) {
    const requirement = this.requirementData?.find(req => req.id === requirement_id);
    return requirement?.reqName || '';
  }

  getAppointmentTypeLabel(type: string): string {
    const appointmentTypes: { [key: string]: string } = {
      in_person: 'In Person',
      phone_call: 'Phone Call',
      video_conference: 'Video Conference',
      phone_or_in_person: 'Phone Call or In Person',
    };
    return appointmentTypes[type] || type;
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.slots-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      if (targetCheckbox.checked) {
        this.selectedSlots = [...this.slotsList];
      } else {
        this.selectedSlots = [];
      }
    } else {
      if (targetCheckbox.checked) {
        this.selectedSlots.push(item);
      } else {
        const index = this.selectedSlots.findIndex(data => data.slots_id == item.slots_id);
        if (index >= 0) {
          this.selectedSlots.splice(index, 1);
        }
      }
    }
  }

  downloadTableData(): void {
    const csvData = this.slotsList.map(slot => ({
      Requirement: slot.requirementName,
      'Appointment Type': this.getAppointmentTypeLabel(slot.appointment_type),
      'Start Date & Time': new Date(slot.start_date_time).toLocaleString(),
      'End Date & Time': new Date(slot.end_date_time).toLocaleString(),
      'Available Capacity': slot.availablecapacity,
      'Remaining Capacity': slot.capacity_appointment_ids.capacity,
      'Appointment Note': slot.appointment_note || '',
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slots_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row)
        .map(value => `"${value}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  }

  loadMoreRecord() {
    this.pageableData.page = this.pageableData.page + 1;
    this.searchSlots(false);
  }

  openSlotDialog(isView: boolean, slot?: any): void {
    const dialogRef = this.dialog.open(AppointmentSlotDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: 'auto',
      height: 'auto',
      data: { isView, slot },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (slot) {
          this.updateSlots(result);
        } else {
          this.saveSlots(result);
        }
      }
    });
  }

  saveSlots(slots: Slots) {
    this.slotService.saveSlots(slots).subscribe({
      next: () => {
        this.toaster.success('Slots created successfully', 'Success!');
        this.searchSlots(true);
      },
      error: () => {
        this.toaster.error('Failed to create Slots', 'Error!');
      },
    });
  }

  updateSlots(slots: Slots) {
    this.slotService.updateSlots(slots).subscribe({
      next: () => {
        this.toaster.success('Slots updated successfully', 'Success!');
        this.searchSlots(true);
      },
      error: () => {
        this.toaster.error('Failed to update Slots', 'Error!');
      },
    });
  }

  onDeleteSlot(slotId: number): void {}

  resetFilter(): void {
    this.searchForm.reset();
    this.searchSlots(true);
  }
}
