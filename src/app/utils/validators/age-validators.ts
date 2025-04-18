import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageMinMaxValidator(control: AbstractControl): ValidationErrors | null {
  var isValidValue: boolean = true;
  try {
    const value = control.value;
    if (!value || value == '') {
      return null;
    }
    const ageArray = value.split('-');
    if (Number.isNaN(ageArray[0]) || Number.isNaN(ageArray[1])) {
      isValidValue = false;
    } else {
      const minAge = ageArray[0];
      const maxAge = ageArray[1];
      if (!(parseInt(minAge) < parseInt(maxAge))) {
        isValidValue = false;
      }
    }
  } catch (error) {}

  return !isValidValue ? { ageError: true } : null;
}
