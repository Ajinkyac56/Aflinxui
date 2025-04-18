export interface SquadronAddSubAdmin {
  id: string;
  squadronId: string;
  userId: string[];
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  roleId: string;
  profilePicture: string;
  name: string;
  isDelete: number;
  subAdminId: string;
}
