export interface Announcement {
  id: string;
  sendToGroup: string[];
  sendToUser: string[];
  sendTo: string;
  messageType: string;
  messageText: string;
  scheduleMessage: true;
  sendDate?: string;
  isUrgent: true;
  isAttachments: string;
  attachments: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDelete: true;
  status: string;
  messageTitle: string;
  startDate: string;
  endDate: string;
  messagePollOptionsList?: [
    {
      pollOptionId: string;
      optionNumber: 0;
      messageDetailId: string;
      pollOptionName: string;
    }
  ];
}

export interface AnnouncementList {
  id: string;
  messageTitle: string;
  messageText: string;
  messageType: string;
  count: number;
  messageUserId: string;
}

export interface User {
  profilePicture: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  id: string;
  messageGroupUserId: string;
  userId1: string;
  role: string;
  viewed: boolean;
}

export interface AnnouncementResponse {
  pollOptionId: string;
  optionNumber: number;
  messageDetailId: string;
  pollOptionName: string;
}
