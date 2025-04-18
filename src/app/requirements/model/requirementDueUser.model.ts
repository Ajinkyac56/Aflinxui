import { RequirementDetails } from './requirementDetails.model';

export interface RequirementDueUser {
  id: string;
  dataFileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  requirementDetails: RequirementDetails[];
  deleteDate: number;
  readinessScore: number;
  fileName: string;
  fileUrl: string;
}
