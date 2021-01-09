import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CanteenPage } from './canteen.page';

describe('CanteenPage', () => {
  let component: CanteenPage;
  let fixture: ComponentFixture<CanteenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanteenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CanteenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
