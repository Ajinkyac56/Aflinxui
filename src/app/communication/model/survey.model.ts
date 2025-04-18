export interface SurveyMessage {
  surveyMessageId: string;
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
  surveyDetailsId: string;
  surveyId: string;
}
