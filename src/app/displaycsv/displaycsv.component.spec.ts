import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaycsvComponent } from './displaycsv.component';

describe('DisplaycsvComponent', () => {
  let component: DisplaycsvComponent;
  let fixture: ComponentFixture<DisplaycsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaycsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaycsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
