import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentsFinishPage } from './payments-finish.page';

describe('PaymentsFinishPage', () => {
  let component: PaymentsFinishPage;
  let fixture: ComponentFixture<PaymentsFinishPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsFinishPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsFinishPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
