import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NextReservationsPage } from './next-reservations.page';

describe('NextReservationsPage', () => {
  let component: NextReservationsPage;
  let fixture: ComponentFixture<NextReservationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextReservationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NextReservationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
