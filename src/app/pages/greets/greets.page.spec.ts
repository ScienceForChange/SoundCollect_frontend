import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GreetsPage } from './greets.page';

describe('GreetsPage', () => {
  let component: GreetsPage;
  let fixture: ComponentFixture<GreetsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GreetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
