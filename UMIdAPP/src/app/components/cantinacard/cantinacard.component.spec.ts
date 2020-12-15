import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CantinacardComponent } from './cantinacard.component';

describe('CantinacardComponent', () => {
  let component: CantinacardComponent;
  let fixture: ComponentFixture<CantinacardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantinacardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CantinacardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
