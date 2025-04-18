import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AnnouncementService } from '../../service/announcement/announcement.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartOptions } from 'chart.js';
import { AnnouncementResponse } from '../../model/announcement.model';

@Component({
  selector: 'app-graph-summary-view',
  templateUrl: './graph-summary-view.component.html',
  styleUrls: ['./graph-summary-view.component.css'],
})
export class GraphSummaryViewComponent implements OnInit {
  // Getting poll Response
  getPollResponse: AnnouncementResponse[] = [];
  pollResponsePercentage: any[] = [];
  messageDetailId: string;

  title = 'ng2-charts-demo';

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            return `${Math.round(value)}%`;
          },
        },
      },
    },
  };

  public pieChartLabels: string[] = [];
  public pieChartDatasets: { data: number[] }[] = [];

  public pieChartLegend = true;
  public pieChartPlugins = [];
  totalUsers: any;
  totalRespondedUsers: any;
  responseCount: any;

  constructor(
    private announcementService: AnnouncementService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<GraphSummaryViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadPollResponse();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // load all te polls
  loadPollResponse() {
    this.announcementService.getResponseList().subscribe({
      next: (responseData: any) => {
        this.getPollResponse = responseData;
        this.getPollResponsePercentage();
      },
      error: () => {
        this.toaster.error('Unable to Load Response', 'Error!');
      },
    });
  }

  // Get poll Summary Data
  getPollResponsePercentage() {
    this.messageDetailId = this.data.msgId;
    this.announcementService.getResponsePercentange(this.messageDetailId).subscribe({
      next: (responseData: any) => {
        const labels: string[] = [];
        const data: number[] = [];
        let totalNotResponded = 100;

        for (const key in responseData.responsePercentage) {
          if (responseData.responsePercentage.hasOwnProperty(key)) {
            const percentage = responseData.responsePercentage[key];
            labels.push(key);
            data.push(Math.round(percentage));
            totalNotResponded -= percentage;
          }
        }

        // Add "Not Responded" category to the chart
        labels.push('Not Responded');
        data.push(Math.round(totalNotResponded));

        this.pieChartLabels = labels;
        this.pieChartDatasets = [{ data: data }];

        // Getting Other Details

        this.totalUsers = responseData.totalUsers;
        this.totalRespondedUsers = responseData.totalRespondedUsers;
        this.responseCount = responseData.responseCount;
      },
      error: () => {
        this.toaster.error('Poll not selected');
      },
    });
  }
}
