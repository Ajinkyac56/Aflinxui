import { PageableData } from 'src/app/models/common/pageable-data.model';

export interface Requirement {
  id: string;
  reqName: string;
  appointmentType: string;
  speciality: string;
  status: string;
  notes: string;
  recordStatus: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDelete: number;
  requirementLogo: string;
}

export interface RequirementSearchDto extends PageableData {
  requirementName?: string;
  speciality?: string;
}
