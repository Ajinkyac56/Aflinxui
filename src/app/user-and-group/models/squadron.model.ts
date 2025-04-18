export interface Squadron {
  id: string;
  squadronName: string;
  status: string;
  adminUserId: string;
  subAdminId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDelete: number;
  squadronLogo: string;
  adminUser: string;
  department: string[];
}
