import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReserveFinishPage } from './reserve-finish.page';

describe('ReserveFinishPage', () => {
  let component: ReserveFinishPage;
  let fixture: ComponentFixture<ReserveFinishPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveFinishPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReserveFinishPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
