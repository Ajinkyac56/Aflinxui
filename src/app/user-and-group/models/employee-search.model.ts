import { PageableData } from 'src/app/models/common/pageable-data.model';

export interface EmployeeSearchDto extends PageableData {
  designation?: string;
  employeeName?: string;
  dodId?: string;
  employeeCategory?: string;
  employeeType?: string;
  role?: string;
  includeAllUser?: boolean;
  excludeBranchAndDept?: boolean;
}

export interface DeptSubAdminDto {
  id?: string;
  departmentId?: string;
  userId?: string[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  roleId?: string;
  profilePicture?: string;
  name?: string;
  isDelete?: number;
  subAdminId?: string;
}
