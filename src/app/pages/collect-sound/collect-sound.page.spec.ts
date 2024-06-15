import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectSoundPage } from './collect-sound.page';

describe('CollectSoundPage', () => {
  let component: CollectSoundPage;
  let fixture: ComponentFixture<CollectSoundPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollectSoundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
