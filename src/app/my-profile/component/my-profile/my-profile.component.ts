import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { WorkDialogComponent } from '../work-dialog/work-dialog.component';
import { WorkService } from '../../service/work/work.service';
import { UserSharedDataService } from 'src/app/services/components/user/user-shared-data.service';
import { workDto } from '../../model/work.model';
import { EducationService } from '../../service/education/education.service';
import { EducationDto } from '../../model/education.model';
import { TrainingService } from '../../service/training/training.service';
import { LicenseService } from '../../service/license/license.service';
import { CertificationService } from '../../service/certification/certification.service';
import { DesignationLetterService } from '../../service/designationLetter/designation-letter.service';
import { DocumentationService } from '../../service/documentation/documentation.service';
import { CertificationDto } from '../../model/certification.model';
import { DocumentDto } from '../../model/documentation.model';
import { UserService } from 'src/app/services/components/user/user.service';
import { User } from 'src/app/user/model/user.model';
import { EducationDialogComponent } from '../education-dialog/education-dialog.component';
import { TrainingDialogComponent } from '../training-dialog/training-dialog.component';
import { CertificationDialogComponent } from '../certification-dialog/certification-dialog.component';
import { LicenseDialogComponent } from '../license-dialog/license-dialog.component';
import { DocumentationDialogComponent } from '../documentation-dialog/documentation-dialog.component';
import { DesignationLetterDialogComponent } from '../designation-letter-dialog/designation-letter-dialog.component';
import { TrainingDto } from '../../model/training.model';
import { LicenseDto } from '../../model/license.model';
import { DesignationDto } from '../../model/designationLetter.model';
import { DownloadService } from 'src/app/services/download/download.service';
import { SquadronService } from 'src/app/user-and-group/components/service/squadron/squadron.service';
import { Squadron } from 'src/app/user-and-group/models/squadron.model';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoryService } from 'src/app/setting/service/category/category.service';
import { Category } from 'src/app/setting/models/category.model';
import { SubCategoryService } from 'src/app/setting/service/sub-category/sub-category.service';
import { SubCategory } from 'src/app/setting/models/sub-category.model';
import { RequirementService } from 'src/app/requirements/service/requirement.service';
import { UserRequirementModel } from 'src/app/requirements/model/userRequirement.model';
import { RequirementImportService } from 'src/app/requirements/service/requirementImport.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
  userId: string;
  user: User;
  squadrons: Squadron[];
  workData: workDto[];
  educationData: EducationDto[];
  certificationData: CertificationDto[];
  documentationData: DocumentDto[];
  trainingData: TrainingDto[];
  licenseData: LicenseDto[];
  designationData: DesignationDto[];
  categoryList: Category[];
  categoryListFiltered: Category[];
  subCategoryList: SubCategory[];
  imageSrc: any;
  userRequirementData: UserRequirementModel[];

  hasAccessToWorkView: boolean = false;
  hasAccessToWorkAdd: boolean = false;
  hasAccessToWorkEdit: boolean = false;
  hasAccessToWorkDelete: boolean = false;
  hasAccessToWorkDownload: boolean = false;

  hasAccessToEducationView: boolean = false;
  hasAccessToEducationAdd: boolean = false;
  hasAccessToEducationEdit: boolean = false;
  hasAccessToEducationDelete: boolean = false;
  hasAccessToEducationDownload: boolean = false;

  hasAccessToTrainingView: boolean = false;
  hasAccessToTrainingAdd: boolean = false;
  hasAccessToTrainingEdit: boolean = false;
  hasAccessToTrainingDelete: boolean = false;
  hasAccessToTrainingDownload: boolean = false;

  hasAccessToCertificationView: boolean = false;
  hasAccessToCertificationAdd: boolean = false;
  hasAccessToCertificationEdit: boolean = false;
  hasAccessToCertificationDelete: boolean = false;
  hasAccessToCertificationDownload: boolean = false;

  hasAccessToLicenseView: boolean = false;
  hasAccessToLicenseAdd: boolean = false;
  hasAccessToLicenseEdit: boolean = false;
  hasAccessToLicenseDelete: boolean = false;
  hasAccessToLicenseDownload: boolean = false;

  hasAccessToDocumentationView: boolean = false;
  hasAccessToDocumentationAdd: boolean = false;
  hasAccessToDocumentationEdit: boolean = false;
  hasAccessToDocumentationDelete: boolean = false;
  hasAccessToDocumentationDownload: boolean = false;

  hasAccessToLetterOfDesignationView: boolean = false;
  hasAccessToLetterOfDesignationAdd: boolean = false;
  hasAccessToLetterOfDesignationEdit: boolean = false;
  hasAccessToLetterOfDesignationDelete: boolean = false;
  hasAccessToLetterOfDesignationDownload: boolean = false;

  hasAccessToReadinessView: boolean = false;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private userDataService: UserSharedDataService,
    private userService: UserService,
    private workService: WorkService,
    private educationService: EducationService,
    private trainingService: TrainingService,
    private licenseService: LicenseService,
    private certificationService: CertificationService,
    private designationService: DesignationLetterService,
    private documentationService: DocumentationService,
    private userSharedDataService: UserSharedDataService,
    private downloadService: DownloadService,
    private squadronService: SquadronService,
    private domSanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private requirementSetvice: RequirementImportService
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.getUser();
    this.getSquadron();
    this.getAllCategories();
    this.getAllSubCategories();
    this.hasAccess();
    this.getWork();
    this.getEducation();
    this.getTraining();
    this.getLicense();
    this.getCertification();
    this.getDesignationLetter();
    this.getDocumentation();
    this.getUserRequirement();
  }

  hasAccess() {
    this.hasAccessToWorkView = this.userSharedDataService.hasAccess('Manage My Profile', 'Work Experience', 'View');
    this.hasAccessToWorkAdd = this.userSharedDataService.hasAccess('Manage My Profile', 'Work Experience', 'Add');
    this.hasAccessToWorkEdit = this.userSharedDataService.hasAccess('Manage My Profile', 'Work Experience', 'Edit');
    this.hasAccessToWorkDelete = this.userSharedDataService.hasAccess('Manage My Profile', 'Work Experience', 'Delete');
    this.hasAccessToWorkDownload = this.userSharedDataService.hasAccess('Manage My Profile', 'Work Experience', 'Download');

    this.hasAccessToEducationView = this.userSharedDataService.hasAccess('Manage My Profile', 'Education', 'View');
    this.hasAccessToEducationAdd = this.userSharedDataService.hasAccess('Manage My Profile', 'Education', 'Add');
    this.hasAccessToEducationEdit = this.userSharedDataService.hasAccess('Manage My Profile', 'Education', 'Edit');
    this.hasAccessToEducationDelete = this.userSharedDataService.hasAccess('Manage My Profile', 'Education', 'Delete');
    this.hasAccessToEducationDownload = this.userSharedDataService.hasAccess('Manage My Profile', 'Education', 'Download');

    this.hasAccessToTrainingView = this.userSharedDataService.hasAccess('Manage My Profile', 'Training', 'View');
    this.hasAccessToTrainingAdd = this.userSharedDataService.hasAccess('Manage My Profile', 'Training', 'Add');
    this.hasAccessToTrainingEdit = this.userSharedDataService.hasAccess('Manage My Profile', 'Training', 'Edit');
    this.hasAccessToTrainingDelete = this.userSharedDataService.hasAccess('Manage My Profile', 'Training', 'Delete');
    this.hasAccessToTrainingDownload = this.userSharedDataService.hasAccess('Manage My Profile', 'Training', 'Download');

    this.hasAccessToCertificationView = this.userSharedDataService.hasAccess('Manage My Profile', 'Certification', 'View');
    this.hasAccessToCertificationAdd = this.userSharedDataService.hasAccess('Manage My Profile', 'Certification', 'Add');
    this.hasAccessToCertificationEdit = this.userSharedDataService.hasAccess('Manage My Profile', 'Certification', 'Edit');
    this.hasAccessToCertificationDelete = this.userSharedDataService.hasAccess('Manage My Profile', 'Certification', 'Delete');
    this.hasAccessToCertificationDownload = this.userSharedDataService.hasAccess('Manage My Profile', 'Certification', 'Download');

    this.hasAccessToLicenseView = this.userSharedDataService.hasAccess('Manage My Profile', 'License', 'View');
    this.hasAccessToLicenseAdd = this.userSharedDataService.hasAccess('Manage My Profile', 'License', 'Add');
    this.hasAccessToLicenseEdit = this.userSharedDataService.hasAccess('Manage My Profile', 'License', 'Edit');
    this.hasAccessToLicenseDelete = this.userSharedDataService.hasAccess('Manage My Profile', 'License', 'Delete');
    this.hasAccessToLicenseDownload = this.userSharedDataService.hasAccess('Manage My Profile', 'License', 'Download');

    this.hasAccessToDocumentationView = this.userSharedDataService.hasAccess('Manage My Profile', 'Documentation', 'View');
    this.hasAccessToDocumentationAdd = this.userSharedDataService.hasAccess('Manage My Profile', 'Documentation', 'Add');
    this.hasAccessToDocumentationEdit = this.userSharedDataService.hasAccess('Manage My Profile', 'Documentation', 'Edit');
    this.hasAccessToDocumentationDelete = this.userSharedDataService.hasAccess('Manage My Profile', 'Documentation', 'Delete');
    this.hasAccessToDocumentationDownload = this.userSharedDataService.hasAccess('Manage My Profile', 'Documentation', 'Download');

    this.hasAccessToLetterOfDesignationView = this.userSharedDataService.hasAccess('Manage My Profile', 'Letter Of Designation', 'View');
    this.hasAccessToLetterOfDesignationAdd = this.userSharedDataService.hasAccess('Manage My Profile', 'Letter Of Designation', 'Add');
    this.hasAccessToLetterOfDesignationEdit = this.userSharedDataService.hasAccess('Manage My Profile', 'Letter Of Designation', 'Edit');
    this.hasAccessToLetterOfDesignationDelete = this.userSharedDataService.hasAccess('Manage My Profile', 'Letter Of Designation', 'Delete');
    this.hasAccessToLetterOfDesignationDownload = this.userSharedDataService.hasAccess('Manage My Profile', 'Letter Of Designation', 'Download');

    this.hasAccessToReadinessView = this.userSharedDataService.hasAccess('Manage My Profile', 'Readiness', 'View');
  }

  getUserId() {
    this.userId = this.userDataService.getUserId();
  }

  downloadFile(filePath: string) {
    this.downloadService.downloadFile(filePath);
  }

  getUser() {
    this.userService.getUserById(this.userId).subscribe({
      next: (response: User) => {
        this.user = response;
      },
      error: error => {
        this.toastr.error('Failed to load Airman data');
      },
    });
  }

  getSquadron() {
    this.squadronService.getSquadrons().subscribe({
      next: (responseData: Squadron[]) => {
        this.squadrons = responseData;
      },
      error: error => {
        this.toastr.error('Failed to load Squadron data');
      },
    });
  }

  getSquadronName(squadronId: string) {
    if (!this.squadrons || this.squadrons.length === 0) {
      return 'N/A';
    }
    const squadron = this.squadrons.find(squad => squad.id === squadronId);
    return squadron ? squadron.squadronName : '';
  }

  getProfilePhoto() {
    const filePath = this.user.photo;
    this.downloadService.downloadFileService(filePath).subscribe({
      next: (responseData: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.imageSrc = this.domSanitizer.bypassSecurityTrustUrl(reader.result as string);
        };
        reader.readAsDataURL(responseData);
      },
      error: error => {
        this.toastr.error(error.error);
      },
    });
  }

  getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (responseData: Category[]) => {
        this.categoryList = responseData;
      },
      error: error => {
        this.toastr.error('Unable to Load Category data', 'Error!');
      },
    });
  }

  getCategoryName(categoryId: string): string {
    if (!this.categoryList || this.categoryList.length === 0) {
      return 'N/A';
    }

    const category = this.categoryList.find(s => s.categoryId === categoryId);
    return category ? category.categoryName : 'N/A';
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
    if (!this.subCategoryList || this.subCategoryList.length === 0) {
      return 'N/A';
    }
    const subCategory = this.subCategoryList.find(cat => cat.subCategoryId === subCategoryId);
    return subCategory ? subCategory.subCategoryName : 'N/A';
  }

  getWork() {
    this.workService.getWork(this.userId).subscribe({
      next: (responseData: workDto[]) => {
        this.workData = responseData;
      },
      error: error => {
        if (error.status === 404) {
        } else {
          this.toastr.error('Failed to load Work data');
        }
      },
    });
  }

  openWorkDialog(data?: workDto): void {
    const dialogRef = this.dialog.open(WorkDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: 'auto',
      height: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { workDto, file } = result;
        if (data) {
          this.updateWork(file, workDto);
        } else {
          this.saveWork(file, workDto);
        }
      }
    });
  }

  saveWork(fileName: string, workDto: workDto) {
    this.workService.saveWork(fileName, workDto).subscribe({
      next: () => {
        this.toastr.success('Work details saved successfully!');
        this.getWork();
      },
      error: err => {
        this.toastr.error('An error occurred while saving work details. Please try again.');
      },
    });
  }

  updateWork(fileName: string, workDto: workDto) {
    this.workService.updateWork(fileName, workDto).subscribe({
      next: () => {
        this.toastr.success('Work details updated successfully!');
        this.getWork();
      },
      error: err => {
        this.toastr.error('An error occurred while updating work details. Please try again.');
      },
    });
  }

  deleteWork(workId: string) {
    const ok = confirm('Are you sure you want to delete this work?');
    if (ok) {
      this.workService.deleteWork(workId).subscribe({
        next: () => {
          this.toastr.success('Work details deleted successfully!');
          this.getWork();
        },
        error: error => {
          this.toastr.error('Failed to delete Work data');
        },
      });
    }
  }

  getEducation() {
    this.educationService.getEducationByUserId(this.userId).subscribe({
      next: (responseData: EducationDto[]) => {
        this.educationData = responseData;
      },
      error: error => {
        if (error.status === 404) {
        } else {
          this.toastr.error('Failed to load Education data');
        }
      },
    });
  }

  openEducationDialog(data?: EducationDto): void {
    const dialogRef = this.dialog.open(EducationDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: 'auto',
      height: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { educationDto, file } = result;
        if (data) {
          this.updateEducation(file, educationDto);
        } else {
          this.saveEducation(file, educationDto);
        }
      }
    });
  }

  saveEducation(fileName: string, educationDto: EducationDto) {
    this.educationService.saveEducation(fileName, educationDto).subscribe({
      next: () => {
        this.toastr.success('Education details saved successfully!');
        this.getEducation();
      },
      error: err => {
        this.toastr.error('An error occurred while saving education details. Please try again.');
      },
    });
  }

  updateEducation(fileName: string, educationDto: EducationDto) {
    this.educationService.updateEducation(fileName, educationDto).subscribe({
      next: () => {
        this.toastr.success('Education details updated successfully!');
        this.getEducation();
      },
      error: err => {
        this.toastr.error('An error occurred while updating education details. Please try again.');
      },
    });
  }

  deleteEducation(educationid: string) {
    const ok = confirm('Are you sure you want to delete this education record?');
    if (ok) {
      this.educationService.deleteEducation(educationid).subscribe({
        next: () => {
          this.toastr.success('Education record deleted successfully!');
          this.getEducation();
        },
        error: error => {
          this.toastr.error('Failed to delete education data');
        },
      });
    }
  }

  getTraining() {
    this.trainingService.getTraining(this.userId).subscribe({
      next: (responseData: TrainingDto[]) => {
        this.trainingData = responseData;
      },
      error: error => {
        if (error.status === 404 && error.error?.msg === 'No Training Record') {
        } else {
          this.toastr.error('Failed to load Training data');
        }
      },
    });
  }

  openTrainingDialog(data?: TrainingDto): void {
    const dialogRef1 = this.dialog.open(TrainingDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: 'auto',
      height: 'auto',
      data: data,
    });
    dialogRef1.afterClosed().subscribe(result => {
      if (result) {
        const { trainingDto, file } = result;
        if (data) {
          this.updateTraining(file, trainingDto);
        } else {
          this.saveTraining(file, trainingDto);
        }
      }
    });
  }

  saveTraining(fileName: string, trainingDto: TrainingDto) {
    this.trainingService.saveTraining(fileName, trainingDto).subscribe({
      next: () => {
        this.toastr.success('Training details saved successfully!');
        this.getTraining();
      },
      error: err => {
        this.toastr.error('An error occurred while saving Training details. Please try again.');
      },
    });
  }

  updateTraining(fileName: string, trainingDto: TrainingDto) {
    this.trainingService.updateTraining(fileName, trainingDto).subscribe({
      next: () => {
        this.toastr.success('Training details updated successfully!');
        this.getTraining();
      },
      error: err => {
        this.toastr.error('An error occurred while updating Training details. Please try again.');
      },
    });
  }

  deleteTraining(trainingId: string) {
    const ok = confirm('Are you sure you want to delete this Training?');
    if (ok) {
      this.trainingService.deleteTraining(trainingId).subscribe({
        next: () => {
          this.toastr.success('Training details deleted successfully!');
          this.getTraining();
        },
        error: err => {
          this.toastr.error('Failed to delete Training details.');
        },
      });
    }
  }

  getCertification() {
    this.certificationService.getCertificationByUserId(this.userId).subscribe({
      next: responseData => {
        this.certificationData = responseData;
      },
      error: error => {
        if (error.status === 404) {
        } else {
          this.toastr.error('Failed to load Certification data');
        }
      },
    });
  }

  openCertificationDialog(data?: CertificationDto): void {
    const dialogRef = this.dialog.open(CertificationDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: 'auto',
      height: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { certificate, file } = result;
        if (data) {
          this.updateCertification(file, certificate);
        } else {
          this.saveCertification(file, certificate);
        }
      }
    });
  }

  saveCertification(fileName: string, certificate: CertificationDto) {
    this.certificationService.saveCertification(fileName, certificate).subscribe({
      next: () => {
        this.toastr.success('Certification details saved successfully!');
        this.getCertification();
      },
      error: err => {
        this.toastr.error('An error occurred while saving certification details. Please try again.');
      },
    });
  }

  updateCertification(fileName: string, certificate: CertificationDto) {
    this.certificationService.updateCertification(fileName, certificate).subscribe({
      next: () => {
        this.toastr.success('Certification details updated successfully!');
        this.getCertification();
      },
      error: err => {
        this.toastr.error('An error occurred while updating certification details. Please try again.');
      },
    });
  }

  deleteCertification(certificationId: string) {
    const ok = confirm('Are you sure you want to delete this certification?');
    if (ok) {
      this.certificationService.deleteCertification(certificationId).subscribe({
        next: () => {
          this.toastr.success('Certification details deleted successfully!');
          this.getCertification();
        },
        error: err => {
          this.toastr.error('Failed to delete certification details.');
        },
      });
    }
  }

  getLicense() {
    this.licenseService.getLicenses(this.userId).subscribe({
      next: responseData => {
        this.licenseData = responseData;
      },
      error: error => {
        if (error.status === 404) {
        } else {
          this.toastr.error('Failed to load License data');
        }
      },
    });
  }

  openLicenseDialog(data?: LicenseDto): void {
    const dialogRef = this.dialog.open(LicenseDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: 'auto',
      height: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { licenseDto, file } = result;
        if (data) {
          this.updateLicense(file, licenseDto);
        } else {
          this.saveLicense(file, licenseDto);
        }
      }
    });
  }

  saveLicense(fileName: string, licenseDto: LicenseDto) {
    this.licenseService.saveLicense(fileName, licenseDto).subscribe({
      next: () => {
        this.toastr.success('License details saved successfully!');
        this.getLicense();
      },
      error: err => {
        this.toastr.error('An error occurred while saving license details. Please try again.');
      },
    });
  }

  updateLicense(fileName: string, licenseDto: LicenseDto) {
    this.licenseService.updateLicense(fileName, licenseDto).subscribe({
      next: () => {
        this.toastr.success('License details updated successfully!');
        this.getLicense();
      },
      error: err => {
        this.toastr.error('An error occurred while updating license details. Please try again.');
      },
    });
  }

  deleteLicense(licenseId: string) {
    const ok = confirm('Are you sure you want to delete this license?');
    if (ok) {
      this.licenseService.deleteLicense(licenseId).subscribe({
        next: () => {
          this.toastr.success('License details deleted successfully!');
          this.getLicense();
        },
        error: err => {
          this.toastr.error('Failed to delete license details.');
        },
      });
    }
  }

  getDocumentation() {
    this.documentationService.getDocument(this.userId).subscribe({
      next: (responseData: DocumentDto[]) => {
        this.documentationData = responseData;
      },
      error: error => {
        if (error.status === 404) {
        } else {
          this.toastr.error('Failed to load Documentation data');
        }
      },
    });
  }

  openDocumentationDialog(data?: DocumentDto): void {
    const dialogRef = this.dialog.open(DocumentationDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: 'auto',
      height: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { document, file } = result;
        if (data) {
          this.updateDocument(file, document);
        } else {
          this.saveDocument(file, document);
        }
      }
    });
  }

  saveDocument(fileName: string, document: DocumentDto) {
    this.documentationService.saveDocument(fileName, document).subscribe({
      next: () => {
        this.toastr.success('Documentation details saved successfully!');
        this.getDocumentation();
      },
      error: err => {
        this.toastr.error('An error occurred while saving documentation details. Please try again.');
      },
    });
  }

  updateDocument(fileName: string, document: DocumentDto) {
    this.documentationService.updateDocument(fileName, document).subscribe({
      next: () => {
        this.toastr.success('Documentation details updated successfully!');
        this.getDocumentation();
      },
      error: err => {
        this.toastr.error('An error occurred while updating documentation details. Please try again.');
      },
    });
  }

  deleteDocument(documentId: string) {
    const ok = confirm('Are you sure you want to delete this document?');
    if (ok) {
      this.documentationService.deleteDocument(documentId).subscribe({
        next: () => {
          this.toastr.success('Documentation details deleted successfully!');
          this.getDocumentation();
        },
        error: err => {
          this.toastr.error('Failed to delete documentation details.');
        },
      });
    }
  }

  getDesignationLetter() {
    this.designationService.getDesignationByUserId(this.userId).subscribe({
      next: (responseData: DesignationDto[]) => {
        this.designationData = responseData;
      },
      error: error => {
        if (error.status === 404) {
        } else {
          this.toastr.error('Failed to load Designation data');
        }
      },
    });
  }

  openDesignationDialog(data?: DesignationDto): void {
    const dialogRef = this.dialog.open(DesignationLetterDialogComponent, {
      maxHeight: '80vh',
      maxWidth: '90vw',
      width: 'auto',
      height: 'auto',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { designationDto, file } = result;
        if (data) {
          this.updateDesignation(file, designationDto);
        } else {
          this.saveDesignation(file, designationDto);
        }
      }
    });
  }

  saveDesignation(fileName: string, designation: DesignationDto) {
    this.designationService.saveDesignation(fileName, designation).subscribe({
      next: () => {
        this.toastr.success('Designation details saved successfully!');
        this.getDesignationLetter();
      },
      error: err => {
        this.toastr.error('An error occurred while saving designation details. Please try again.');
      },
    });
  }

  updateDesignation(fileName: string, designation: DesignationDto) {
    this.designationService.updateDesignation(fileName, designation).subscribe({
      next: () => {
        this.toastr.success('Designation details updated successfully!');
        this.getDesignationLetter();
      },
      error: err => {
        this.toastr.error('An error occurred while updating designation details. Please try again.');
      },
    });
  }

  deleteDesignation(designationId: string) {
    const ok = confirm('Are you sure you want to delete this designation?');
    if (ok) {
      this.designationService.deleteDesignation(designationId).subscribe({
        next: () => {
          this.toastr.success('Designation details deleted successfully!');
          this.getDesignationLetter();
        },
        error: err => {
          this.toastr.error('Failed to delete designation details.');
        },
      });
    }
  }
  getUserRequirement() {
    this.requirementSetvice.getUserRequirements(this.userId).subscribe({
      next: responseData => {
        this.userRequirementData = responseData;
      },
      error: error => {
        this.toastr.error('Failed to load User Requirement data');
      },
    });
  }
}
