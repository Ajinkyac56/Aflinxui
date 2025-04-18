export interface ChecklistMessage {
  checklistMessageId: string;
  sendToGroup: string[];
  sendToUser: string[];
  messageText: string;
  scheduleMessage: boolean;
  sendDate: string;
  status: string;
  messageTitle: string;
  readCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  checklistDetailsId: string;
  checklistId: string;
}
