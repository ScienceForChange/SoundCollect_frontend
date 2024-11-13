import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { SoundsPage } from './sounds.page';

describe('Tab2Page', () => {
  let component: SoundsPage;
  let fixture: ComponentFixture<SoundsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoundsPage, IonicModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SoundsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
