import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SenhasComponent } from './senhas.component';

describe('SenhasComponent', () => {
  let component: SenhasComponent;
  let fixture: ComponentFixture<SenhasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenhasComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SenhasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
