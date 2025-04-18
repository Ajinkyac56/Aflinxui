import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthGuardService } from './security/auth-guard.service';
import { Router } from '@angular/router';
import { UserSharedDataService } from './services/components/user/user-shared-data.service';
import { DownloadService } from './services/download/download.service';
import { ToastrService } from 'ngx-toastr';
import { downloadDocument } from './utils/download-utils';
import { LoaderService } from './shared/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'Asego';
  apiUrl = environment.apiUrl;
  constructor(
    public loaderService: LoaderService,
    private authguardservice: AuthGuardService,
    private userSharedDataService: UserSharedDataService,
    private router: Router,
    private downloadFileService: DownloadService,
    private toaster: ToastrService
  ) {
    console.log('apiUrl - ' + this.apiUrl);
  }
  ngOnInit() {
    if (window.location.href.indexOf('view-policy-qr-code') > 0) {
      const q = new URL(window.location.href).searchParams.get('q');
      this.router.navigate(['/view-policy-qr-code'], {
        queryParams: { createPolicyId: q },
      });
    } else if (window.location.href.indexOf('downloadFileOpen') > 0) {
      const filePath = new URL(window.location.href).searchParams.get('filePath');
      if (filePath) {
        this.downloadFileService.downloadFileOpen(encodeURIComponent(filePath));
      } else {
        this.toaster.error('Invalid File Path or file deleted', 'Error!');
      }
    } else if (window.location.href.indexOf('paymentLink') > 0) {
      const q = new URL(window.location.href).searchParams.get('q');
      this.router.navigate(['/paymentLink'], {
        queryParams: { q: q },
      });
    } else if (window.location.href.indexOf('View-Assistance-Services-Benefits') > 0) {
      const q = new URL(window.location.href).searchParams.get('planId');
      this.router.navigate(['/View-Assistance-Services-Benefits'], {
        queryParams: { planId: q },
      });
    } else if (window.location.href.indexOf('resetPassword') > 0) {
      const q = new URL(window.location.href).searchParams.get('q');
      this.router.navigate(['/resetPassword'], {
        queryParams: { q: q },
      });
    } else {
      if (this.authguardservice.isLoggedIn()) {
        if (new URL(window.location.href).searchParams.get('clear') == 'true') {
          this.authguardservice.logout();
          this.router.navigateByUrl('/login');
        } else if (new URL(window.location.href).searchParams.get('fromOnBoarding') == 'true') {
          const fromOnBoarding = new URL(window.location.href).searchParams.get('fromOnBoarding');
          const partnerItem = new URL(window.location.href).searchParams.get('partner');
          this.router.navigate(['/mou'], {
            state: {
              isEdit: true,
              fromOnBoarding: fromOnBoarding,
              partner: JSON.parse(partnerItem),
            },
          });
        } else if (new URL(window.location.href).searchParams.get('quotation') == 'true') {
          const tripType = new URL(window.location.href).searchParams.get('tripType');
          const startDate = new URL(window.location.href).searchParams.get('startDate');
          const endDate = new URL(window.location.href).searchParams.get('endDate');
          const destination = new URL(window.location.href).searchParams.get('destination');
          const region = new URL(window.location.href).searchParams.get('region');
          const duration = new URL(window.location.href).searchParams.get('duration');
          const selectPlanDataMap = new URL(window.location.href).searchParams.get('selectPlanDataMap');
          this.router.navigate(['/quotation'], {
            state: {
              isEdit: true,
              tripType: tripType,
              startDate: startDate,
              endDate: endDate,
              destination: destination,
              region: region,
              duration: duration,
              selectPlanDataMap: JSON.parse(selectPlanDataMap),
            },
          });
        } else if (new URL(window.location.href).searchParams.get('downloadInvoice') == 'true') {
          const queryParam = new URL(window.location.href).searchParams.get('selectPlanDataMap');
          const invoiceType = new URL(window.location.href).searchParams.get('invoiceType');
          downloadDocument(queryParam, invoiceType, this.router, '');
        } else if (new URL(window.location.href).searchParams.get('downloadDocument') == 'true') {
          const queryParam = new URL(window.location.href).searchParams.get('selectDataMap');
          const type = new URL(window.location.href).searchParams.get('type');
          downloadDocument(queryParam, type, this.router, '');
        } else if (new URL(window.location.href).searchParams.get('downloadReceipt') == 'true') {
          const queryParam = new URL(window.location.href).searchParams.get('selectDataMap');
          const type = new URL(window.location.href).searchParams.get('type');
          downloadDocument(queryParam, type, this.router, '');
        } else if (new URL(window.location.href).searchParams.get('comparePlan') == 'true') {
          // const selectPlanData = new URL(window.location.href).searchParams.get('selectPlanData');
          this.router.navigate(['/compare-plan'], {
            state: {
              isEdit: true,
              // tripType: tripType,
              // startDate: startDate,
              // endDate: endDate,
              // destination: destination,
              // region: region,
              // duration: duration,
              // selectPlanData: JSON.parse(selectPlanData),
            },
          });
        } else {
          this.router.navigateByUrl('/login');
        }
      }
    }
  }
}
