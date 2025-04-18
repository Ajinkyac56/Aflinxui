import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/components/user/user.service';
import { SchedulingService } from '../../service/scheduling.service';
import { ScheduleModel } from '../../model/schedule.model';
import { DownloadService } from 'src/app/services/download/download.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { CalenderModule } from '../../model/calender.model';
import { MatDialog } from '@angular/material/dialog';
import { EventViewDialogComponent } from '../event-view-dialog/event-view-dialog.component';
import { environment } from 'src/environments/environment';
import { AppointmentModule } from '../../model/appointment.model';
import { MatSelectChange } from '@angular/material/select';
import { announcementSearchDto, ScheduleListSearch } from 'src/app/models/SearchCondition.model';
import { GlobalConstants } from 'src/app/config/GlobalConstants';
import { ScheduleSlotDialogComponent } from 'src/app/my-message/components/schedule-slot-dialog/schedule-slot-dialog.component';
import { Announcement } from 'src/app/communication/model/announcement.model';
import { AnnouncementService } from 'src/app/communication/service/announcement/announcement.service';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  pageableData: ScheduleListSearch = {
    page: 0,
    size: GlobalConstants.DEFAULT_PAGE_SIZE,
    orderBy: '',
    direction: '',
    isPageAble: true,
  };

  // Selected days will be stored in this array
  selectedDays: number[] = [];
  days = new FormControl([]);
  DaysList: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  scheduleData: ScheduleModel[] = [];
  selectedSchedule: ScheduleModel[] = [];
  scheduleDataFilterd: ScheduleModel[] = [];
  currentTab: number = 1;
  profilePicture: SafeResourceUrl | string;
  requirement: string;
  schedule: FormGroup;
  calendarVisible = signal(true);
  currentEvents = signal<EventApi[]>([]);
  userId: string;

  // Calendar Configuration
  calenderData: CalenderModule[];
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay,listWeek', // dayGridMonth - Removed
    },
    initialView: 'timeGridWeek', // dayGridMonth -- for month view
    events: [], // Initially empty, will be updated dynamically
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // ✅ Uses 24-hour format
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // ✅ Uses 24-hour format for event times
    },
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    hiddenDays: [],
    eventDrop: this.handleEventDrop.bind(this),
  });

  expandAction: boolean;

  constructor(
    private toaster: ToastrService,
    private userservice: UserService,
    private router: Router,
    private dialog: MatDialog,
    private announcementSevice: AnnouncementService,
    private scheduleService: SchedulingService, // Service for fetching events
    private downloadService: DownloadService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder,
    private userDataService: UserSharedDataService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.schedule = this.fb.group({
      scheduleSearch: [''],
    });
    this.expandAction = environment.expand_action;
  }

  ngOnInit(): void {
    this.getUserId();
    this.getScheduleAllList();
    this.fetchCalendarEvents();
  }

  // Function to convert date into yyyy-MM-ddTHH:mm:ss format
  formatToLocalDate(date: Date): string {
    const localDate = date.toLocaleDateString('en-CA'); // en-CA is yyyy-MM-dd format
    const localTime = date.toLocaleTimeString('en-GB', { hour12: false }); // 24-hour format
    return `${localDate}T${localTime}`;
  }

  handleEventDrop(eventInfo) {
    const eventStartDate = new Date(eventInfo.event.extendedProps.startDate); // Original event start date
    const newStartDate = new Date(eventInfo.event.start); // New start date after dropping
    const newEndDate = new Date(eventInfo.event.end);
    const currentDate = new Date(); // Get the current date and time
    const msgId = eventInfo.event.extendedProps.messageDetailsId;

    if (newStartDate < currentDate || newStartDate === eventStartDate) {
      eventInfo.revert();
    } else {
      const event: Announcement = {
        id: '',
        sendToGroup: [],
        sendToUser: [],
        sendTo: '',
        messageType: '',
        messageText: '',
        scheduleMessage: true,
        isUrgent: true,
        isAttachments: '',
        attachments: '',
        link: '',
        createdAt: '',
        updatedAt: '',
        createdBy: '',
        updatedBy: '',
        isDelete: true,
        status: '',
        messageTitle: '',
        startDate: this.formatToLocalDate(newStartDate),
        endDate: this.formatToLocalDate(newEndDate),
      };
      this.announcementSevice.updateEvent(event, msgId).subscribe({
        next: response => {
          this.toaster.success(response.msg || 'Event Updated', 'Success!');
          this.fetchCalendarEvents();
        },
        error: errorResponse => {
          const errorMessage = errorResponse?.error?.msg || 'Failed to Update Event';
          this.toaster.error(errorMessage, 'Error!');
        },
      });
    }
  }

  // Handle the day selection from dropdown
  onDaysSelect(event: MatSelectChange): void {
    const selectedDaysArray: string[] = event.value;
    this.selectedDays = this.convertDayNamesToNumbers(selectedDaysArray);
    if (this.selectedDays.length === 0) {
      this.resetCalendarToDefault();
    } else {
      this.updateCalendarDays();
    }
  }

  // Reset the calendar to its default view (showing all days)
  resetCalendarToDefault(): void {
    this.selectedDays = [];
    this.calendarOptions().hiddenDays = [];
    this.calendarOptions().validRange = null;
    this.calendarOptions().events = this.calenderData;
    this.fetchCalendarEvents();
  }

  // Convert the selected day names to day numbers (e.g., Sunday -> 0, Monday -> 1)
  convertDayNamesToNumbers(dayNames: string[]): number[] {
    const dayMapping: { [key: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return dayNames.map(day => dayMapping[day]);
  }

  // Update calendar days to show only selected ones
  updateCalendarDays(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the current month
    const startFormatted = startOfMonth.toISOString().split('T')[0];
    const endFormatted = endOfMonth.toISOString().split('T')[0];

    this.calendarOptions().validRange = {
      start: startFormatted,
      end: endFormatted,
    };

    // Filter the days to hide
    const allDays = [0, 1, 2, 3, 4, 5, 6];
    const hiddenDays = allDays.filter(day => !this.selectedDays.includes(day));

    // Update the hiddenDays to hide the unselected days
    this.calendarOptions().hiddenDays = hiddenDays;

    // Filter events based on selected days
    this.calendarOptions().events = this.calenderData.filter(event => {
      const eventStartDate = new Date(event.startDate);
      const eventDay = eventStartDate.getDay(); // Get day of the week (0-6)
      return this.selectedDays.includes(eventDay);
    });
  }

  getUserId() {
    this.userId = this.userDataService.getUserId();
  }

  fetchCalendarEvents() {
    this.scheduleService.getCalendarEvents(this.userId).subscribe({
      next: (responseData: CalenderModule[]) => {
        const transformedEvents = responseData.map(event => ({
          id: event.reqId ? String(event.reqId) : String(Date.now()), // Ensure a valid unique ID
          reqId: event.reqId,
          appMessageId: event.appMessageId,
          title: event.messageTitle || 'Untitled Event', // Use messageTitle as event title
          start: event.startDate, // Ensure format is 'YYYY-MM-DDTHH:mm:ss'
          end: event.endDate,
          messageDetailsId: event.messageDetailsId,
          appointmentType: event.appointmentType,
          extendedProps: {
            userId: event.sendToUser, // Extra event details
            status: event.status,
            messageText: event.messageText,
            startDate: event.startDate, // Store the original start date for validation
            endDate: event.endDate,
          },
        }));

        // Update calendar options dynamically
        this.calendarOptions.update(options => ({
          ...options,
          events: transformedEvents,
        }));
      },
      error: errorResponse => {
        console.error('Error fetching calendar events:', errorResponse);
        this.toaster.error('Failed to load events', 'Error!');
      },
    });
  }

  getScheduleAllList() {
    this.pageableData.requirementName = this.schedule.get('scheduleSearch')?.value;
    this.scheduleService.getScheduleList(this.pageableData).subscribe({
      next: responseData => {
        this.scheduleData = responseData;
        this.scheduleDataFilterd = this.scheduleDataFilterd.slice();
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Unable to Load Data';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }

  handleCalendarToggle() {
    this.calendarVisible.update(bool => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update(options => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: any) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  // Rescheduling from the calendar
  handleEventClick(clickInfo: any) {
    const dialogRef = this.dialog.open(EventViewDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        event: clickInfo.event,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchCalendarEvents(); // Re-fetch the events from the service
    });
  }

  // Open dialog to Re-Scheduling appointment in schedule list
  handleRescheduleClick(schedule: ScheduleModel) {
    const dialogRef1 = this.dialog.open(ScheduleSlotDialogComponent, {
      width: 'auto',
      data: {
        info: schedule, // Pass the event data
        isEventReschedule: false,
        isAppointmetReschedule: true,
      },
    });
    dialogRef1.afterClosed().subscribe(result => {
      if (result) {
        this.getScheduleAllList();
      }
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  checkBoxValueClicked(event: any, type: any, item: any) {
    const targetCheckbox = event.target as HTMLInputElement;
    if (type == 'all') {
      const checkboxes = document.querySelectorAll('.schedule-table input[type="checkbox"]');
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        checkbox.checked = targetCheckbox.checked;
      });

      this.selectedSchedule = targetCheckbox.checked ? [...this.scheduleData] : [];
    } else {
      if (targetCheckbox.checked) {
        this.selectedSchedule.push(item);
      } else {
        const index = this.selectedSchedule.findIndex(data => data.requirement == item.requirement);
        if (index >= 0) {
          this.selectedSchedule.splice(index, 1);
        }
      }
    }
  }

  downloadTableData(): void {
    const csvData = this.scheduleData.map(schedule => ({
      Requirement: schedule.requirement,
      'First Name': schedule.firstName,
      'Last Name': schedule.lastName,
      Date: schedule.date,
      Time: schedule.time,
      Status: schedule.status,
    }));

    const csvContent = this.convertToCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  convertToCSV(data: any[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row)
        .map(value => `"${value}"`)
        .join(',')
    );
    return [headers, ...rows].join('\n');
  }

  onEditClick() {}
  onViewClick() {}

  onStatusClick(updatedStatus: string, messageId: string) {
    const appointment: AppointmentModule = {
      email: '',
      profilePicture: '',
      appointmentId: '',
      name: '',
      sendToGroup: [],
      sendToUser: [],
      messageText: '',
      scheduleMessage: true,
      sendDate: '',
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      updatedBy: '',
      status: updatedStatus,
      messageTitle: '',
      reqId: '',
      readCount: 0,
      appMessageId: messageId,
    };

    this.scheduleService.updateStatus(appointment).subscribe({
      next: response => {
        this.getScheduleAllList();
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error?.msg || 'Failed to Update Status';
        this.toaster.error(errorMessage, 'Error!');
      },
    });
  }
}
