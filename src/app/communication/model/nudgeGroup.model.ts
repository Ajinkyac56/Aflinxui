export interface NudgeGroup {
  messageGroupId: string;
  messageGroupName: string;
  messageGroupDesc: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDelete: number;
  groupUserList: string[];
  userCount?: number;
}
