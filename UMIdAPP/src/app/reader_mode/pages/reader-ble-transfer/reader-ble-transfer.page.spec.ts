import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReaderBleTransferPage } from './reader-ble-transfer.page';

describe('ReaderBleTransferPage', () => {
  let component: ReaderBleTransferPage;
  let fixture: ComponentFixture<ReaderBleTransferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaderBleTransferPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReaderBleTransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
