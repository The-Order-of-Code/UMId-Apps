import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChoiceTicketPage } from './choice-ticket.page';

describe('ChoiceTicketPage', () => {
  let component: ChoiceTicketPage;
  let fixture: ComponentFixture<ChoiceTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoiceTicketPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChoiceTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
