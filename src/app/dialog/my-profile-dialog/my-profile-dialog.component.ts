import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CertificationDto } from 'src/app/my-profile/model/certification.model';
import { DesignationDto } from 'src/app/my-profile/model/designationLetter.model';
import { DocumentDto } from 'src/app/my-profile/model/documentation.model';
import { EducationDto } from 'src/app/my-profile/model/education.model';
import { LicenseDto } from 'src/app/my-profile/model/license.model';
import { TrainingDto } from 'src/app/my-profile/model/training.model';
import { workDto } from 'src/app/my-profile/model/work.model';
import { CertificationService } from 'src/app/my-profile/service/certification/certification.service';
import { DesignationLetterService } from 'src/app/my-profile/service/designationLetter/designation-letter.service';
import { DocumentationService } from 'src/app/my-profile/service/documentation/documentation.service';
import { EducationService } from 'src/app/my-profile/service/education/education.service';
import { LicenseService } from 'src/app/my-profile/service/license/license.service';
import { TrainingService } from 'src/app/my-profile/service/training/training.service';
import { WorkService } from 'src/app/my-profile/service/work/work.service';
import { UserRequirementModel } from 'src/app/requirements/model/userRequirement.model';
import { RequirementImportService } from 'src/app/requirements/service/requirementImport.service';
import { DownloadService } from 'src/app/services/download/download.service';
import { Category } from 'src/app/setting/models/category.model';
import { SubCategory } from 'src/app/setting/models/sub-category.model';
import { CategoryService } from 'src/app/setting/service/category/category.service';
import { SubCategoryService } from 'src/app/setting/service/sub-category/sub-category.service';
import { SquadronService } from 'src/app/user-and-group/components/service/squadron/squadron.service';
import { Squadron } from 'src/app/user-and-group/models/squadron.model';

@Component({
  selector: 'app-my-profile-dialog',
  templateUrl: './my-profile-dialog.component.html',
  styleUrls: ['./my-profile-dialog.component.css'],
})
export class MyProfileDialogComponent implements OnInit {
  downloadFile(filePath: string) {
    this.downloadService.downloadFile(filePath);
  }

  squadrons: Squadron[];
  imageSrc: any;
  workData: workDto[];
  educationData: EducationDto[];
  certificationData: CertificationDto[];
  documentationData: DocumentDto[];
  trainingData: TrainingDto[];
  licenseData: LicenseDto[];
  designationData: DesignationDto[];
  categoryList: Category[];
  subCategoryList: SubCategory[];
  userRequirementData: UserRequirementModel[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private downloadService: DownloadService,
    private squadronService: SquadronService,
    private toastr: ToastrService,
    private domSanitizer: DomSanitizer,
    private workService: WorkService,
    private educationService: EducationService,
    private trainingService: TrainingService,
    private licenseService: LicenseService,
    private certificationService: CertificationService,
    private designationService: DesignationLetterService,
    private documentationService: DocumentationService,
    public dialogRef: MatDialogRef<MyProfileDialogComponent>,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private requirementSetvice: RequirementImportService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllSubCategories();
    this.getSquadron();
    this.getProfilePhoto();
    this.getWork();
    this.getEducation();
    this.getTraining();
    this.getCertification();
    this.getLicense();
    this.getDocumentation();
    this.getDesignationLetter();
    this.getUserRequirement();
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: responseData => {
        this.categoryList = responseData;
      },
      error: error => {
        this.toastr.error('Unable to Load Category data', 'Error!');
      },
    });
  }

  getCategoryName(categoryId: string): string {
    const item = this.categoryList.filter(s => s.categoryId === categoryId);
    return item.length === 1 ? item[0].categoryName : '';
  }

  getAllSubCategories(): void {
    this.subCategoryService.getAllSubCategory().subscribe({
      next: (responseData: SubCategory[]) => {
        this.subCategoryList = responseData;
      },
      error: error => {
        this.toastr.error('Unable to Load Sub Category data', 'Error!');
      },
    });
  }

  getSubCategoryName(subCategoryId: string): string {
    const subCategory = this.subCategoryList.find(cat => cat.subCategoryId === subCategoryId);
    return subCategory ? subCategory.subCategoryName : 'Sub Category Not Found';
  }

  getProfilePhoto() {
    const filePath = this.data.photo;
    this.downloadService.downloadFileService(filePath).subscribe({
      next: responseData => {
        const reader = new FileReader();
        reader.onload = e => {
          this.imageSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(reader.result.toString());
        };
        reader.readAsDataURL(responseData);
      },
      error: error => {
        console.error('Error downloading file:', error);
      },
    });
  }

  getSquadron() {
    this.squadronService.getSquadrons().subscribe({
      next: (responseData: Squadron[]) => {
        this.squadrons = responseData;
      },
      error: error => {
        console.error('Error fetching Squadron data:', error);
        this.toastr.error('Failed to load Squadron data');
      },
    });
  }

  getSquadronNameByID(squadronId: string) {
    const squadron = this.squadrons.find(squad => squad.id === squadronId);
    return squadron.squadronName;
  }

  getWork() {
    this.workService.getWork(this.data.id).subscribe({
      next: (responseData: workDto[]) => {
        this.workData = responseData;
      },
      error: error => {
        if (error.status === 404) {
          console.error('No Work record found for this Airman.');
        } else {
          console.error('Error fetching Work data:', error);
          this.toastr.error('Failed to load Work data');
        }
      },
    });
  }

  getEducation() {
    this.educationService.getEducationByUserId(this.data.id).subscribe({
      next: (responseData: EducationDto[]) => {
        this.educationData = responseData;
      },
      error: error => {
        if (error.status === 404) {
          console.error('No Education record found for this user.');
        } else {
          console.error('Error fetching Education data:', error);
          this.toastr.error('Failed to load Education data');
        }
      },
    });
  }

  getTraining() {
    this.trainingService.getTraining(this.data.id).subscribe({
      next: (responseData: TrainingDto[]) => {
        this.trainingData = responseData;
      },
      error: error => {
        if (error.status === 404 && error.error?.msg === 'No Training Record') {
          console.error('No training record found for this Airman.');
        } else {
          console.error('Error fetching Training data:', error);
          this.toastr.error('Failed to load Training data');
        }
      },
    });
  }

  getCertification() {
    this.certificationService.getCertificationByUserId(this.data.id).subscribe({
      next: responseData => {
        this.certificationData = responseData;
      },
      error: error => {
        if (error.status === 404) {
          console.error('No Certification record found for this Airman.');
        } else {
          console.error('Error fetching Certification data:', error);
          this.toastr.error('Failed to load Certification data');
        }
      },
    });
  }

  getLicense() {
    this.licenseService.getLicenses(this.data.id).subscribe({
      next: responseData => {
        this.licenseData = responseData;
      },
      error: error => {
        if (error.status === 404) {
          console.error('No License record found for this Airman.');
        } else {
          console.error('Error fetching License data:', error);
          this.toastr.error('Failed to load License data');
        }
      },
    });
  }

  getDocumentation() {
    this.documentationService.getDocument(this.data.id).subscribe({
      next: (responseData: DocumentDto[]) => {
        this.documentationData = responseData;
      },
      error: error => {
        if (error.status === 404) {
          console.error('No Documentation record found for this Airman.');
        } else {
          console.error('Error fetching Documentation data:', error);
          this.toastr.error('Failed to load Documentation data');
        }
      },
    });
  }
  getDesignationLetter() {
    this.designationService.getDesignationByUserId(this.data.id).subscribe({
      next: (responseData: DesignationDto[]) => {
        this.designationData = responseData;
      },
      error: error => {
        if (error.status === 404) {
          console.error('No Designation record found for this Airman.');
        } else {
          console.error('Error fetching Designation data:', error);
          this.toastr.error('Failed to load Designation data');
        }
      },
    });
  }
  getUserRequirement() {
    this.requirementSetvice.getUserRequirements(this.data.id).subscribe({
      next: responseData => {
        this.userRequirementData = responseData;
      },
      error: error => {
        this.toastr.error('Failed to load User Requirement data');
      },
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
