import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscalaDolorPage } from './escala-dolor.page';

describe('EscalaDolorPage', () => {
  let component: EscalaDolorPage;
  let fixture: ComponentFixture<EscalaDolorPage>;

  beforeEach((() => {
    fixture = TestBed.createComponent(EscalaDolorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
