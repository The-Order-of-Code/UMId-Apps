import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyTicketDayPage } from './buy-ticket-day.page';

describe('BuyTicketDayPage', () => {
  let component: BuyTicketDayPage;
  let fixture: ComponentFixture<BuyTicketDayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyTicketDayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyTicketDayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
