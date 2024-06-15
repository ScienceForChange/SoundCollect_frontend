import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoseDetectionPage } from './pose-detection.page';

describe('PoseDetectionPage', () => {
  let component: PoseDetectionPage;
  let fixture: ComponentFixture<PoseDetectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PoseDetectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
