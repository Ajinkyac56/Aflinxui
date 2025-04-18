import { PageableData } from './common/pageable-data.model';

export interface SearchDataLoader extends PageableData {
  fileName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  module?: string;
}
export interface searchViewAlphaRostar extends PageableData {
  name?: string;
  email?: string;
  status?: string;
  dataFileId?: string;
}
export interface SearchRequirementImpoart extends PageableData {
  name?: string;
  status?: string;
  dataFileId?: string;
}

export interface SubCategorySearchDto extends PageableData {
  categoryId?: string;
  subCategoryName?: string;
}

export interface ReqWeightSearchDto extends PageableData {
  requirementName?: string;
}

export interface specialitySeachDto extends PageableData {
  specialityName?: string;
}

export interface CategorySeachDto extends PageableData {
  categoryName?: string;
}

export interface nudgeGroupSearchDto extends PageableData {
  messageGroupName?: string;
  isDelete?: number;
}

export interface rolesSearchDto extends PageableData {
  name?: string;
}

export interface airmanSearchDto extends PageableData {
  firstName?: string;
}

export interface nudgeUserGroupSearchDto extends PageableData {
  name?: string;
  isDelete?: number;
  messageGroupId?: string;
}

export interface slotsSearchDto extends PageableData {
  requirementId?: string;
  startDate?: string;
  endDate?: string;
  appointmentType?: string;
}

export interface announcementSearchDto extends PageableData {
  messageTitle?: string;
  messageType?: string;
  messageText?: string;
  reqId?: string;
  slotId?: string;
}

export interface announcementUserSearchDto extends PageableData {
  name?: string;
  id?: string;
}

export interface appointmentSearchDto extends PageableData {
  messageTitle?: string;
}

export interface appointmentUserSearchDto extends PageableData {
  name?: string;
  appointmentId?: string;
}

export interface SquadronSearchDto extends PageableData {
  squadronName?: string;
}

export interface CommandActivitySearchDto extends PageableData {
  deptName?: string;
}

export interface DeptSubAdminSearchDto extends PageableData {
  name?: string;
  departmentId?: string;
  isDelete?: number;
}

export interface SquadronSubAdminSearchDto extends PageableData {
  name?: string;
  squadronId?: string;
}

export interface ScheduleListSearch extends PageableData {
  requirementName?: string;
}

export interface ChecklistSearchDto extends PageableData {
  checklistName?: string;
  checklistType?: string;
}

export interface SurveySearchDto extends PageableData {
  surveyId?: string;
  surveyName?: string;
  surveyDescription?: string;
  surveyType?: string;
}

export interface ChecklistDetailSearchDto extends PageableData {
  messageTitle?: string;
}

export interface ChecklistUserSearchDto extends PageableData {
  checklistDetailsId?: string;
  name?: string;
}

export interface SurveyDetailSearchDto extends PageableData {
  messageTitle?: string;
}
