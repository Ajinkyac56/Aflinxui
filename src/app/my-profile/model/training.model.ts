export interface TrainingDto {
  trainingId: string;
  userId: string;
  trainingTitle: string;
  startDate: string;
  endDate: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDelete: boolean;
  subCategoryId: string;
  categoryId: string;
  grantedBy: string;
  expirationDate: string;
  reminderCount: number;
  lastReminder: string;
}
