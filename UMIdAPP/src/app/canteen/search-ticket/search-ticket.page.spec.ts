import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchTicketPage } from './search-ticket.page';

describe('SearchTicketPage', () => {
  let component: SearchTicketPage;
  let fixture: ComponentFixture<SearchTicketPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTicketPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
