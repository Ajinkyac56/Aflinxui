export interface AppointmentModule {
  appointmentId: string;
  name: string;
  email: string;
  requirementLogo?: string;
  profilePicture?: string;
  userCount?: number;
  appMessageId: string;
  sendTo?: string;
  sendToGroup: string[];
  sendToUser: string[];
  messageText: string;
  scheduleMessage: true;
  sendDate: string;
  slotId?: string;
  reqId: string;
  status: string;
  requirementName?: string;
  messageTitle: string;
  readCount: 0;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  endDate?: string;
  startDate?: string;
}

export interface AppointmentUser {
  profilePicture: string;
  name: string;
  email: string;
  phoneNumber: string;
  id: string;
  appMessageId: string;
  appointmentId: string;
  role: string;
  slotId: string | null;
  startDate: string | null;
  viewed: boolean;
}
