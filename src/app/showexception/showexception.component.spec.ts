import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowexceptionComponent } from './showexception.component';

describe('ShowexceptionComponent', () => {
  let component: ShowexceptionComponent;
  let fixture: ComponentFixture<ShowexceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowexceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowexceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
