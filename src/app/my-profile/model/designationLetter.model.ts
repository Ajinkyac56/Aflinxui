export interface DesignationDto {
  designationId: string;
  userId: string;
  designationTitle: string;
  designationDate: Date;
  designationDescription: string;
  fileName: string;
  isDelete: boolean;
  subCategoryId: string;
  categoryId: string;
  grantedBy: string;
  expirationDate: Date;
}
