export interface LicenseDto {
  licensesId?: string;
  userId: string;
  licenseTitle: string;
  licenseDate: string;
  licenseExpireDate: string;
  fileName: string;
  isDelete: boolean;
  subCategoryId: string;
  categoryId: string;
  grantedBy: string;
  reminderCount: number;
}
