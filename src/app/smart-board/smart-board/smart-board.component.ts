import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-smart-board',
  templateUrl: './smart-board.component.html',
  styleUrl: './smart-board.component.css',
})
export class SmartBoardComponent {
  smartBoard: FormGroup;
  smartBoardControl = new FormControl();

  // Static Data
  ActionData: string[] = ['Announcement', 'Appointment', 'Checklist', 'Event', 'Survey', 'Direct'];
  filteredActions: string[] = this.ActionData;

  constructor(private fb: FormBuilder, private router: Router) {
    this.smartBoard = this.fb.group({
      actions: [''],
    });
  }

  ngOnInit(): void {
    this.smartBoardControl.valueChanges.subscribe(() => {
      this.ActionData = this.filteredActionList();
    });
  }

  // searching in dropdown
  filteredActionList() {
    const searchTerm = this.smartBoardControl.value?.toLowerCase() || '';
    return this.filteredActions.filter(item => item.toLowerCase().includes(searchTerm));
  }

  onActionSelect(event: any): void {
    const selectedValue = event.value;
    switch (selectedValue) {
      case 'Announcement':
        this.router.navigate(['/dashboard/communication/create-announcement']);
        break;
      case 'Appointment':
        this.router.navigate(['/dashboard/scheduling/create-appointments']);
        break;
      case 'Checklist':
        this.router.navigate(['/dashboard/communication/create-checklist']);
        break;
      case 'Event':
        this.router.navigate(['/dashboard/communication/create-announcement'], { queryParams: { event: true } });
        break;
      case 'Direct':
        this.router.navigate(['/dashboard/communication/create-announcement'], { queryParams: { direct: true } });
        break;
      case 'Survey':
        // this.router.navigate(['/dashboard/scheduling/appointments']);
        break;
    }
  }
}
