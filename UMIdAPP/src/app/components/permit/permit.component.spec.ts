import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PermitComponent } from './permit.component';

describe('PermitComponent', () => {
  let component: PermitComponent;
  let fixture: ComponentFixture<PermitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermitComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
