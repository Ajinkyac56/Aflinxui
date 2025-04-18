import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuardService } from 'src/app/security/auth-guard.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { User } from 'src/app/user/model/user.model';
import { MENU_CONFIG, MenuItem } from 'src/app/utils/menu-config';
import { loadHeadScript } from 'src/app/utils/script.utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  menuConfig: MenuItem[] = [];
  loggedInUser: User | undefined;
  public userType: any;
  constructor(
    private authGuardService: AuthGuardService,
    private router: Router,
    private userSharedDataService: UserSharedDataService,
    private cd: ChangeDetectorRef
  ) {
    this.initMenuItem();
    this.loggedInUser = this.userSharedDataService.getUserDetails();
  }

  ngOnInit(): void {
    loadHeadScript('assets/js/app.min.js', 'app.min.js');
    loadHeadScript('assets/js/app.init.js', 'app.init.js');
    loadHeadScript('assets/js/sidebarmenu.js', 'sidebarmenu.js');
    loadHeadScript('assets/js/custom.js', 'custom.js');
    loadHeadScript('assets/libs/prismjs/prism.js', 'prism.js');
    this.router.navigate([this.menuConfig[0].routeLink]);
    this.cd.detectChanges();
    this.userType = localStorage.getItem('userType');
  }
  logout() {
    this.authGuardService.logout();
    this.userSharedDataService.logout();
    this.router.navigateByUrl('/login');
    window.location.reload();
  }
  initMenuItem() {
    let menu_Details: MenuItem[] = MENU_CONFIG;

    menu_Details.forEach((element: any) => {
      if (element.featureGroup && element.feature && element.action) {
        if (element.childItem.length == 0) {
          if (this.userSharedDataService.hasAccess(element.featureGroup, element.feature, element.action)) this.menuConfig.push(element);
        } else {
          var childItems1: MenuItem[] = [];
          element.childItem.forEach((child1: any) => {
            if (child1.childItem.length == 0) {
              if (this.userSharedDataService.hasAccess(child1.featureGroup, child1.feature, child1.action)) childItems1.push(child1);
            } else {
              var childItems2: MenuItem[] = [];
              child1.childItem.forEach((child2: any) => {
                if (this.userSharedDataService.hasAccess(child1.featureGroup, child2.feature, child2.action)) childItems2.push(child1);
              });
              child1.childItem = childItems2;
            }
          });
          element.childItem = childItems1;
          if (element.childItem.length > 0) {
            this.menuConfig.push(element);
          }
        }
      } else {
        this.menuConfig.push(element);
      }
    });
  }
}
