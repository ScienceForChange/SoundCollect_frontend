import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordRecoveryCodePage } from './password-recovery-code.page';

describe('PasswordRecoveryCodePage', () => {
  let component: PasswordRecoveryCodePage;
  let fixture: ComponentFixture<PasswordRecoveryCodePage>;

  beforeEach((() => {
    fixture = TestBed.createComponent(PasswordRecoveryCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
