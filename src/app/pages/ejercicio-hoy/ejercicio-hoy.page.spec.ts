import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EjercicioHoyPage } from './ejercicio-hoy.page';

describe('EjercicioHoyPage', () => {
  let component: EjercicioHoyPage;
  let fixture: ComponentFixture<EjercicioHoyPage>;

  beforeEach((() => {
    fixture = TestBed.createComponent(EjercicioHoyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
