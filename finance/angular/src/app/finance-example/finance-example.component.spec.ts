import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceExample } from './finance-example.component';

describe('FinanceExample', () => {
  let component: FinanceExample;
  let fixture: ComponentFixture<FinanceExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceExample],
    }).compileComponents();

    fixture = TestBed.createComponent(FinanceExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
