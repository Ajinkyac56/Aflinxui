import { environment } from 'src/environments/environment';

export const GlobalConstants = {
  API_SERVER_URL: environment.apiUrl,
  API_BASE_URL: '/aflinx/api/v1',
  B2B_WS_BROKER_URL: environment.b2bWsBrokerURL,
  SOCKJS_ENDPOINT: environment.SockJSEndpoint,
  AUTH_API: '/authenticate',
  RESET_PWD_API: '/resetPassword',
  FORGET_PWD: '/aflinx/api/v1/user/forgotPassword?',
  LOGOUT_API: '/logout',
  INSURER_API: '/insurer',
  AREA_API: '/area',
  CITY_API: '/city',
  USER_API: '/user',
  SEND_EMAil: '/sendMail',
  REQUEST_RESET_PWD_API: '/requestResetPwd',
  COUNTRY_API: '/country',
  STATE_API: '/state',
  REGION_API: '/region',
  PLAN_TYPE_API: '/planType',
  PERMISSION: '/permission',
  USER_PERMISSION: '/user/permission',
  COVERAGE_API: '/coverage',
  COVERAGE_CATEGORY_API: '/coverageCategory',
  COVERAGE_SUB_CATEGORY_API: '/subCategory',
  CURRENCY_API: '/currency',
  MASTER_SELECT_API: '/masterSelect',
  STORAGE: '/storage',
  EMAIL_OTP: '/otp/email',
  EMAIL_OTP_VERIFY: '/otp/email/verify',
  COMMON_OTP: '/otp/common',
  COMMON_OTP_VERIFY: '/otp/common/verify',
  POSTAL_PINCODE: 'https://api.postalpincode.in/pincode/',
  EMAIL_PATTERN: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$',
  NAME_PATTERN: '^[A-Za-z]+(?: [A-Za-z]+)*$',
  OCR_IMAGE_URL: environment.OCR_IMAGE_URL + '/api/Ocr',
  PINCODE_PATTERN: '^[1-9][0-9]{5}$',
  MOBILE_PATTERN_WITHOUT_CODE: '^[1-9]{1}[0-9]{9}$',
  MOBILE_PATTERN_WITH_CODE: '^((\\+91-?)|0)?[0-9]{10}$',
  PASSPORT_NUMBER_PATTERN: '^[A-Z][0-9]{7}$',
  SWIFT_CODE_PATTERN: '^[A-Z]{6}[A-Z2-9][A-NP-Z0-9](XXX|[A-WYZ0-9][A-Z0-9]{2})?$',
  TAN_NO_PATTERN: '^[A-Z]{4}[0-9]{5}[A-Z]$',
  MICR_CODE_PATTERN: '^[0-9]{9}$',
  SEARCH_NO_AUTH_API: '/NoAuth/policy/search',
  MASTER_SELECT_NO_AUTH_API: '/NoAuth/policy/masterSelect',
  CURRENCY_NO_AUTH_API: '/NoAuth/policy/currency',
  IS_PAYMENT_DONE: 'isPaymentDone',
  DEFAULT_PAGE_SIZE: 30,
  PROFILE_UPLOAD: '/user/store',
  PROFILE_FETCH: '/user/fetch',
  NOTIFICATION: '/notification',
  SMARTBOARD_API: '/smartboard',
  DELETEAPI: '/deleteApi',
  RESETAPI: '/dummyRecordsApi',
  CREATEAPI: '/dummyRecordsApi',
  // ---------------------------------------//

  //USER API'S
  CREATE_MULTIPLE_USERS_API: '/createUser',

  // DATA FILE API'S
  DATA_FILES_API: '/dataFilesApi',
  SEARCH_DATA_FILES_LIST: '/searchDataFiles',

  //USER IMPORT API'S
  USERS_IMPORT_API: '/usersImportApi',
  SEARCH_USERS_IMPORT_LIST: '/searchUsersList',

  //Requirement Import API'S
  REQUIREMENT_IMPORT_API: '/reqImportApi',
  SEARCH_REQUIREMENT_IMPORT_LIST: '/searchReqImport',
  USER_REQUIREMENTS_LIST: '/userRequirementsList',

  //Requirement  API'S
  REQUIREMENT_API: '/requirementApi',
  REQUIREMENT_LIST_API: '/requirementList',

  // Requirement Due User
  REQUIREMENT_DUE_USER_API: '/reqDueUserApi',
  SAVE_REQUIREMENT_DUE_USER: '/saveReqDueUser',

  // Speciality API
  SPECIALITY_API: '/specialityApi',

  //Sub Category API
  SUBCATEGORY_API: '/subCategory',

  //Category API
  CATEGORY_API: '/categoryApi',

  //Requirement Weight API
  REQUIREMENT_WEIGHT_API: '/requirementWeightApi',

  // Nudge API
  MESSAGE_GROUP_API: '/messageGroupApi',
  MESSAGE_GROUP_USER_API: '/messageGroupUserApi',
  SAVE_MESSAGE_GROUP_API: '/saveMessageGroup',
  GET_MESSAGE_GROUP_LIST_API: '/getMessageGroupList',
  SEARCH_MESSAGE_GROUP_API: '/searchMessageGroup',
  SAVE_MESSAGE_GROUP_USER_API: '/saveMessageGroupUser',

  // Announcement API
  MESSAGE_API: '/messageApi',
  MESSAGE_SAVE_API: '/saveMessage',
  LIST_MESSAGES_API: '/getMyMessageList',
  MESSAGE_UPDATE_API: '/updateMessageEvent',
  MESSAGE_API_GET_MESSAGETYPE: '/getMessagebyMesssageType',
  PATCH_USER_RESPONSE_MESSAGE_API: '/patchUserResponse',
  MESSAGE_POLL_OPTIONS_GET_API: '/messagePollOptionList',
  MESSAGE_USER_LIST: '/messageUserlist',
  RESPONSE: '/responseList',

  // Slot API
  SLOTS_API: '/slotsApi',
  SLOTS_GET_API: '/getSlotsByReqId',
  SLOTS_GET_LIST_API: '/getSlot', // Get all list of slots
  SAVE_SLOTS_API: '/saveslotAppointment',

  // Appointment API
  APPOINTMENT_API: '/appointmentApi',
  APPOINTMENT_SAVE_API: '/saveAppointment',
  APPOINTMENT_GET_API: '/getAppointment',
  APPOINTMENT_SEARCH_API: '/searchAppointment',
  CHECK_APPOINTMENT_CONFLICT_API: '/appointmentConflict',
  LIST_APPOINTMENT_SLOT_API: '/getAppointmentSlotlist',
  UPDATE_RECORD_STATUS: '/updateRecordStatus',

  // Checklist
  CHECKLIST_API: '/checklistApi',
  CHECKLIST_MESSAGE_API: '/checklistmessageApi',

  // Checklist Task
  CHECKLIST_TASK_API: '/checklistTaskApi',

  //SurveyList
  SURVEY_API: '/surveyApi',
  SURVEY_MESSAGE_API: '/surveymessageApi',

  // Scheduling
  SCHEDULE_API: '/scheduleApi',
  GET_SCHEDULE_LIST: '/getScheduleList',

  // My Profile
  TRAINING_API: '/trainingApi',
  CERTIFICATION_API: '/certificateApi',
  DESIGNATION_API: '/designationApi',
  DOCUMENT_API: '/documentApi',
  EDUCATION_API: '/educationApi',
  LICENSE_API: '/licenseApi',
  WORK_API: '/workExperienceApi',

  // Sqaudron
  SQAUDRON_API: '/squadronApi',
  SQUADRON_SUBADMIN_API: '/squadronSubAdminApi',

  // dept SubAdmin
  DEPT_SUB_ADMIN_API: '/deptSubAdminApi',
  GET_DEPT_SUB_ADMIN_LIST: '/getDeptSubAdminList',
  DELETE_DEPT_SUB_ADMIN: '/deleteDeptSubAdmin',
  SAVE_DEPT_SUB_ADMIN: '/saveDeptSubAdmin',
};

export const DATEConstant = {
  FORMAT_ddMMyyyy: 'dd/MM/yyyy',
  FORMAT_YYYMMDD: 'yyyy-MM-dd',
};
