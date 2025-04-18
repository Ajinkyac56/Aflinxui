export interface CertificationDto {
  certificateId: string;
  userId: string;
  categoryId: string;
  titleOfLicense: string;
  certificateDate: string;
  expirationDate: string;
  certificationDocumentName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDelete: boolean;
  subCategoryId: string;
  grantedBy: string;
  reminderCount: number;
  lastReminder: string;
}
