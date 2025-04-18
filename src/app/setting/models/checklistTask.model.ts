export interface TaskPayload {
  taskId: string;
  checklistId: string;
  taskName: string;
  taskNote: string;
  showYes: boolean;
  showNotes: boolean;
  showUpload: boolean;
  showQr: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDelete: number;
}
