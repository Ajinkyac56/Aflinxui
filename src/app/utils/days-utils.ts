import { PlanTypeConstants } from '../config/GlobalConstants';

export function formatDays(data: any, rateTypeData: any, type: any, plan_type: any, riderRateTypeData: any) {
  if (plan_type === 'COSTPLAN') {
    if (type === PlanTypeConstants.ADD_FORMAT_DAYS) {
      if (rateTypeData.name === 'Day-Wise') {
        data?.rate?.rateDetailsList?.forEach((element, index) => {
          if (index < data?.rate?.rateDetailsList?.length) {
            element.days = '0' + '-' + element.days;
          }
        });
        data?.riders?.forEach(element => {
          element.riderDetailsList.forEach((riderData, index) => {
            if (index < element?.riderDetailsList?.length) {
              riderData.days = '0' + '-' + riderData.days;
            }
          });
        });
      }
      return data;
    } else {
      if (rateTypeData.name === 'Day-Wise') {
        data?.editCost?.rate?.rateDetailsList?.forEach((element, index) => {
          if (index < data?.editCost?.rate?.rateDetailsList?.length) {
            element.days = element.days.includes('-') ? element.days.split('-')[1] : element.days;
          }
        });
        data?.editCost?.riders?.forEach(element => {
          element.riderDetailsList.forEach((riderData, index) => {
            if (index < element?.riderDetailsList?.length) {
              riderData.days = riderData.days.includes('-') ? riderData.days.split('-')[1] : riderData.days;
            }
          });
        });
        return data;
      }
    }
    return data;
  } else {
    if (type === PlanTypeConstants.ADD_FORMAT_DAYS) {
      if (rateTypeData.name === 'Day-Wise') {
        data?.sellingPlanDetailsList?.forEach((element, index) => {
          if (index < data?.sellingPlanDetailsList?.length) {
            element.days = '0' + '-' + element.days;
          }
        });
      }
      if (data.riders.length > 0 && riderRateTypeData != undefined) {
        if (riderRateTypeData.name === 'Day-Wise' || rateTypeData.name === 'Day-Wise') {
          data?.riders?.forEach(element => {
            if (riderRateTypeData.id === element.rateType) {
              element.riderDetailsList.forEach((riderData, index) => {
                if (index < element?.riderDetailsList?.length) {
                  riderData.days = '0' + '-' + riderData.days;
                }
              });
            }
          });
        }
      }
      return data;
    } else {
      if (rateTypeData.name === 'Day-Wise') {
        data?.editSelling?.sellingPlanDetailsList?.forEach((element, index) => {
          if (index < data?.editSelling?.sellingPlanDetailsList?.length) {
            element.days = element.days.includes('-') ? element.days.split('-')[1] : element.days;
          }
        });
      }
      if (data?.editSelling?.riders.length > 0 && riderRateTypeData != undefined) {
        if ((data?.editSelling?.riders.length > 0 && riderRateTypeData['name'] === 'Day-Wise') || rateTypeData.name === 'Day-Wise') {
          data?.editSelling?.riders?.forEach(element => {
            element.riderDetailsList.forEach((riderData, index) => {
              if (riderRateTypeData.id === element.rateType) {
                if (index < element?.riderDetailsList?.length) {
                  riderData.days = riderData.days.includes('-') ? riderData.days.split('-')[1] : riderData.days;
                }
              }
            });
          });
          return data;
        }
      }
    }
    return data;
  }
}
