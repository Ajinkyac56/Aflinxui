import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function daysMinMaxValidator(control: AbstractControl): ValidationErrors | null {
  var isValidValue: boolean = true;
  try {
    const value = control.value;
    if (!value || value == '') {
      return null;
    }
    const daysArray = value.split('-');
    if (Number.isNaN(daysArray[0]) || Number.isNaN(daysArray[1])) {
      isValidValue = false;
    } else {
      const minDays = daysArray[0];
      const maxDays = daysArray[1];
      if (parseInt(minDays) <= 0 || !(parseInt(minDays) < parseInt(maxDays))) {
        isValidValue = false;
      }
    }
  } catch (error) {}

  return !isValidValue ? { ageError: true } : null;
}
