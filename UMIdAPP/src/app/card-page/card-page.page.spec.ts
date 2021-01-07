import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardPagePage } from './card-page.page';

describe('CardPagePage', () => {
  let component: CardPagePage;
  let fixture: ComponentFixture<CardPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
