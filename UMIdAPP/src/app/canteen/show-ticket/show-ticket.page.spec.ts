import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowTicketPage } from './show-ticket.page';

describe('ShowTicketPage', () => {
  let component: ShowTicketPage;
  let fixture: ComponentFixture<ShowTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTicketPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
