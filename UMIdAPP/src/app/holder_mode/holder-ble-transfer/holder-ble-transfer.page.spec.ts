import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HolderBleTransferPage } from './holder-ble-transfer.page';

describe('HolderBleTransferPage', () => {
  let component: HolderBleTransferPage;
  let fixture: ComponentFixture<HolderBleTransferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolderBleTransferPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HolderBleTransferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
