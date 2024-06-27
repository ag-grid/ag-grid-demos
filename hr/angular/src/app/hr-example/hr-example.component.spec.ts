import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HRExample } from './hr-example.component';

describe('HRExample', () => {
  let component: HRExample;
  let fixture: ComponentFixture<HRExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HRExample],
    }).compileComponents();

    fixture = TestBed.createComponent(HRExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
