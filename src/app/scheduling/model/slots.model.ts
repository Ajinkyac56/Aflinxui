export interface Slots {
  slots_id: string;
  requirement_id: string;
  requirementName?: string;
  appointment_type: string;
  start_date_time: string;
  end_date_time: string;
  time: string;
  time_unit: string;
  appointment_note: string;
  availablecapacity: string;
  capacity_appointment_ids: SlotCapacityAppointmentIdsDto;
}
export interface SlotCapacityAppointmentIdsDto {
  capacity: number;
  appMesssageIds: string[];
}

export interface bookSlot {
  appMessageId: string;
  sendToGroup: string[];
  sendToUser: string[];
  messageText: string;
  scheduleMessage: true;
  sendDate?: string;
  slotId: string;
  reqId: string;
  status?: string;
  messageTitle?: string;
  readCount?: 0;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}
