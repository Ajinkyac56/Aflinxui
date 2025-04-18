import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { RequirementService } from '../../service/requirement.service';
import { ToastrService } from 'ngx-toastr';
import { Requirement } from '../../model/requirement.model';
import { RequirementDueUser } from '../../model/requirementDueUser.model';
import { RequirementDueUserService } from '../../service/requirementDueUser.service';
import { RequirementDetails } from '../../model/requirementDetails.model';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-requirement-airman',
  templateUrl: './import-requirement.component.html',
  styleUrls: ['./import-requirement.component.css'],
})
export class ImportRequirementComponent {
  currentTab = 1; // Track the current tab
  headers: string[] = [];
  systemVariables: string[] = ['First Name', 'Last Name', 'Email']; // Fixed system variables
  requirementData: Requirement[] = [];
  requirementDataArray: Requirement[] = [];
  systermDataArray: string[] = [];
  mapping: { [key: string]: string } = {};
  excelData: (string | number)[][] = [];
  mappedData: any[] = [];
  errorMessage: string | null = null;
  mappingError: string | null = null;
  fileUploaded = false;
  requirementVeriable: string[] = [];
  requirementDueUser: RequirementDueUser[] = [];
  fileName: string;
  isSubmitting = false;
  isView: any;
  isEdit: any;
  requirementSearchControl = new FormControl('');
  filteredSystemVariables: string[] = [];
  constructor(
    private requirementService: RequirementService,
    private requirementDueUserService: RequirementDueUserService,
    private toaster: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllRequirements();
    this.filteredSystemVariables = [...this.systemVariables];
    this.requirementSearchControl.valueChanges.pipe(debounceTime(200)).subscribe(searchText => {
      this.filteredSystemVariables = this.systemVariables.filter(variable => variable.toLowerCase().includes(searchText.toLowerCase()));
    });
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      this.toaster.error('Please upload a single file.');
      return;
    }
    const file = target.files[0];
    this.fileName = file.name; // Capture file name

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Get headers and data
      const jsonData: unknown[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (Array.isArray(jsonData) && jsonData.length > 0 && Array.isArray(jsonData[0])) {
        this.headers = jsonData[0].map(String); // First row is the headers
        this.excelData = jsonData.slice(1) as (string | number)[][];
        this.fileUploaded = true; // Remaining rows are the data
        this.errorMessage = null; // Clear error message
        this.toaster.success('File uploaded successfully.');
      } else {
        this.errorMessage = 'Invalid headers in the uploaded file.';
        this.toaster.error(this.errorMessage);
      }
    };

    reader.readAsBinaryString(target.files[0]);
  }

  getFileName(): string {
    return this.fileName;
  }

  mapColumns(): void {
    // Mapping without validation
    this.requirementDueUser = this.excelData.map((row: any[]) => {
      const requirementDetails: RequirementDetails[] = [];

      // Parse dynamic requirement details
      for (const item of this.requirementData) {
        const dueDateKey = `${item.reqName}DueDate`;
        const statusKey = `${item.reqName}status`;

        const dueDateHeader = Object.keys(this.mapping).find(key => this.mapping[key] === dueDateKey);
        const statusHeader = Object.keys(this.mapping).find(key => this.mapping[key] === statusKey);

        if (dueDateHeader && statusHeader) {
          const dueDateIndex = this.headers.indexOf(dueDateHeader);
          const statusIndex = this.headers.indexOf(statusHeader);

          if (row[dueDateIndex] && row[statusIndex]) {
            requirementDetails.push({
              requirementId: item.id,
              requirementName: item.reqName,
              requirementDate: row[dueDateIndex],
              requirementStatus: row[statusIndex],
            });
          }
        }
      }

      // Map RequirementDueUser fields
      const mappedUser: RequirementDueUser = {
        id: '',
        dataFileId: '',
        userId: '',
        firstName: this.getMappedValue(row, 'First Name'),
        lastName: this.getMappedValue(row, 'Last Name'),
        email: this.getMappedValue(row, 'Email'),
        requirementDetails,
        deleteDate: this.getMappedValue(row, 'Delete Date') ? Number(this.getMappedValue(row, 'Delete Date')) : 0,
        readinessScore: this.getMappedValue(row, 'Readiness Score') ? Number(this.getMappedValue(row, 'Readiness Score')) : null,
        fileName: this.fileName,
        fileUrl: 'url/to/file',
      };

      return mappedUser;
    });

    this.mappedData = [...this.requirementDueUser]; // Ensure data is copied for preview
    this.mappingError = null; // Clear mapping error
    this.toaster.success('Data mapped successfully.');
  }

  getMappedValue(row: any[], variable: string): string {
    const header = Object.keys(this.mapping).find(key => this.mapping[key] === variable);
    if (header) {
      const index = this.headers.indexOf(header);
      return index !== -1 ? String(row[index]) : '';
    }
    return '';
  }

  next(): void {
    if (this.currentTab === 1 && !this.fileUploaded) {
      this.errorMessage = 'Please upload a file before proceeding.';
      this.toaster.error(this.errorMessage);
      return; // Prevent moving to the next step
    }
    if (this.currentTab === 2) {
      this.mapColumns();
      if (this.mappingError) return; // Prevent moving to the next step if mapping is invalid
    }
    if (this.currentTab < 3) {
      this.currentTab++;
    }
  }

  previous(): void {
    if (this.currentTab > 1) {
      this.currentTab--;
    }
  }

  finalizeImport(): void {
    if (!this.requirementDueUser || this.requirementDueUser.length === 0) {
      this.toaster.error('No data to import. Please upload and map the file.');
      return;
    }

    // Prevent multiple submissions
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    this.requirementDueUserService.saveRequirementsDueUser(this.requirementDueUser).subscribe({
      next: () => {
        this.toaster.success('Requirements imported successfully!');
        this.router.navigate(['/dashboard/data-loader/requirements']);
      },
      error: error => {
        this.toaster.error('Failed to import requirements. Please try again.');
        console.error('Import Error:', error);
      },
      complete: () => {
        // Ensure `isSubmitting` is reset in all cases
        this.isSubmitting = false;
      },
    });
  }

  getAllRequirements() {
    this.requirementService.getAllRequirements().subscribe({
      next: responseData => {
        this.requirementData = responseData;
        this.requirementDataArray = this.requirementData.slice();
        for (const item of this.requirementData) {
          this.systemVariables.push(`${item.reqName}DueDate`, `${item.reqName}status`);
        }
        this.systermDataArray = this.systemVariables.slice();
      },

      error: error => {
        this.toaster.error('Unable to Load Requirement Data', 'Error!');
      },
    });
  }

  downloadTemplate() {
    const templateUrl = './assets/templates/Requirement.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'Requirements.xlsx';
    link.click();
  }
}
