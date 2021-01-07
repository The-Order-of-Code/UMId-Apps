import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PinAuthPage } from './pin-auth.page';

describe('PinAuthPage', () => {
  let component: PinAuthPage;
  let fixture: ComponentFixture<PinAuthPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinAuthPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PinAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
