import {AbstractControl} from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   *
   * @param control AbstractControl
   */
  // @ts-ignore
  static matchPassword(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('cpassword')?.value;

    if (password !== confirmPassword) {
      control.get('cpassword')?.setErrors({confirmPassword: true});
    } else {
      control.get('cpassword')?.setErrors(null);
      return null;
    }
  }
}
