import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/components/user/user.service';
import { User } from 'src/app/user/model/user.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-airman',
  templateUrl: './import-airman.component.html',
  styleUrls: ['./import-airman.component.css'],
})
export class ImportAirmanComponent {
  currentTab = 1; // Track the current tab
  headers: string[] = [];
  systemVariables: string[] = ['First Name', 'Last Name', 'Email', 'Mobile No', 'Role', 'DODID', 'Photos', 'Squadron'];
  mapping: { [key: string]: string } = {};
  excelData: (string | number)[][] = [];
  mappedData: any[] = [];
  errorMessage: string | null = null;
  mappingError: string | null = null;
  fileUploaded = false;
  airman: User[] = [];
  fileName: string;
  isSubmitting = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastr: ToastrService, private router: Router) {}

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      this.toastr.error('Please upload a single file.');
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
        this.toastr.success('File uploaded successfully.');
        this.next();
      } else {
        this.errorMessage = 'Invalid headers in the uploaded file.';
        this.toastr.error(this.errorMessage);
      }
    };

    reader.readAsBinaryString(target.files[0]);
  }

  mapColumns(): void {
    if (this.validateMapping()) {
      this.mappedData = this.excelData.map((row: any[]) => {
        const mappedRow: any = {};
        for (const variable of this.systemVariables) {
          const header = Object.keys(this.mapping).find(key => this.mapping[key] === variable);
          if (header) {
            const index = this.headers.indexOf(header);
            mappedRow[variable] = row[index];
          }
        }
        return mappedRow;
      });
      this.mappingError = null; // Clear mapping error
    } else {
      this.mappingError = 'Please map all system variables before proceeding.';
      this.toastr.error(this.mappingError);
    }
  }

  validateMapping(): boolean {
    // Ensure all system variables are mapped
    return this.systemVariables.every(variable => Object.values(this.mapping).includes(variable));
  }

  next(): void {
    if (this.currentTab === 1 && !this.fileUploaded) {
      this.errorMessage = 'Please upload a file before proceeding.';
      this.toastr.error(this.errorMessage);
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
    if (!this.fileUploaded || this.mappedData.length === 0) {
      this.toastr.error('No data to send. Please upload and map the file.');
      return;
    }

    // Prevent multiple submissions
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.airman = this.mappedData.map(row => ({
      checked: false, // Default value
      activation: null, // Default or placeholder value
      squadron: null, // Default or placeholder value
      squadronId: '', // Default or placeholder value
      squadronName: row['Squadron'], // Default or placeholder value
      id: '', // Default empty string or generate unique ID if required
      firstName: row['First Name'],
      lastName: row['Last Name'],
      email: row['Email'],
      mobile: row['Mobile No'],
      userType: row['Role'],
      dodId: row['DODID'],
      isActive: 1, // Default value for active status
      password: '', // Default password if needed
      fullName: '', // Combine first and last names
      photo: row['Photos'], // Placeholder or default value
      middleName: '', // Placeholder or default value
      userName: row['Email'], // Generate userName
      readinessScore: 0,
    }));

    this.userService.importUsers(this.airman, this.fileName).subscribe({
      next: () => {
        this.toastr.success('Users imported successfully!');
        this.router.navigate(['/dashboard/data-loader']);
      },
      error: error => {
        this.toastr.error('Failed to import users. Please try again.');
        console.error('Import Error:', error);
      },
      complete: () => {
        this.isSubmitting = false; // Ensure `isSubmitting` is reset in all cases
      },
    });
  }
  downloadTemplate() {
    const templateUrl = 'assets/templates/Members.xlsx';
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'Members.xlsx';
    link.click();
  }
}
